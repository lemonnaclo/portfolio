$ErrorActionPreference = 'Stop'
$portfolioRoot = $PSScriptRoot
function Read-PortfolioJson([string]$filePath) {
  return ([IO.File]::ReadAllText($filePath) | ConvertFrom-Json)
}
function Merge-PortfolioProperties($destination, $source) {
  if ($null -ne $source) { foreach ($property in $source.PSObject.Properties) { $destination[$property.Name] = $property.Value } }
}
function Get-PortfolioAssetUrl([string]$projectId, [string]$filename) {
  $encodedParts = foreach ($part in ($filename -split '/')) { [Uri]::EscapeDataString($part) }
  return './projects/' + [Uri]::EscapeDataString($projectId) + '/assets/' + ($encodedParts -join '/')
}
$profileData = Read-PortfolioJson (Join-Path $portfolioRoot 'data/profile.json')
$projectIndex = Read-PortfolioJson (Join-Path $portfolioRoot 'data/projects.json')
$caseData = Read-PortfolioJson (Join-Path $portfolioRoot 'data/case-studies.json')
$overrideData = Read-PortfolioJson (Join-Path $portfolioRoot 'data/project-overrides.json')
$thumbnailDirectory = Join-Path $portfolioRoot 'asset/thumbnails'
[IO.Directory]::CreateDirectory($thumbnailDirectory) | Out-Null
Add-Type -AssemblyName System.Drawing
$categoryOrder = @($profileData.categoryOrder)
if (-not $categoryOrder.Count) { $categoryOrder = @('Stage Design','Production Design','3D','VMD') }
$featuredIds = @($profileData.featured)
$orderedIndex = @()
foreach ($category in $categoryOrder) {
  $categoryEntries = @($projectIndex | Where-Object { $_.category -eq $category })
  foreach ($featuredId in $featuredIds) { $orderedIndex += @($categoryEntries | Where-Object { $_.id -eq $featuredId }) }
  $orderedIndex += @($categoryEntries | Where-Object { $featuredIds -notcontains $_.id })
}
$orderedIndex += @($projectIndex | Where-Object { $categoryOrder -notcontains $_.category })
$compiledProjects = foreach ($entry in $orderedIndex) {
  $projectPath = Join-Path $portfolioRoot ('projects/' + $entry.id + '/project.json')
  $original = Read-PortfolioJson $projectPath
  $compiled = [ordered]@{}
  Merge-PortfolioProperties $compiled $original
  $compiled['displayTitle'] = $original.title
  Merge-PortfolioProperties $compiled $overrideData.PSObject.Properties[$entry.id].Value
  Merge-PortfolioProperties $compiled $caseData.PSObject.Properties[$entry.id].Value
  # Authored page composition is edited in each project's layout.json.
  if ($original.layoutFile) {
    $compiled['layout'] = Read-PortfolioJson (Join-Path (Split-Path $projectPath) $original.layoutFile)
  }
  $imageRecords = @($original.media | Where-Object { $_.type -eq 'image' -and $_.path })
  $coverFile = $compiled['coverFile']
  if (-not $coverFile -and $imageRecords.Count -gt 0) {
    $selectedIndex = 0
    if ($null -ne $compiled['thumbnailIndex']) { $selectedIndex = [Math]::Min([int]$compiled['thumbnailIndex'], $imageRecords.Count - 1) }
    $coverFile = $imageRecords[$selectedIndex].path
  }
  if ($coverFile) {
    $coverPath = Join-Path $portfolioRoot ('projects/' + $entry.id + '/assets/' + $coverFile)
    if (Test-Path -LiteralPath $coverPath) {
      $compiled['coverUrl'] = Get-PortfolioAssetUrl $entry.id $coverFile
      $displayFile = $compiled['coverDisplayFile']
      if (-not $displayFile) {
        $coverRecord = $imageRecords | Where-Object { $_.path -eq $coverFile } | Select-Object -First 1
        if ($coverRecord.displayPath) { $displayFile = $coverRecord.displayPath }
      }
      if (-not $displayFile) { $displayFile = $coverFile }
      $compiled['coverDisplayUrl'] = Get-PortfolioAssetUrl $entry.id $displayFile

    }
  }
  # A thumbnail can be selected separately from the detail-page cover.
  $thumbnailFile = $compiled['thumbnailFile']
  if (-not $thumbnailFile) { $thumbnailFile = $coverFile }
  if ($thumbnailFile) {
    $thumbnailSourcePath = Join-Path $portfolioRoot ('projects/' + $entry.id + '/assets/' + $thumbnailFile)
    if (Test-Path -LiteralPath $thumbnailSourcePath) {
      $thumbnailPath = Join-Path $thumbnailDirectory ($entry.id + '.jpg')
      $sourceImage = [Drawing.Image]::FromFile($thumbnailSourcePath)
      if ($sourceImage.PropertyIdList -contains 274) {
        $orientation = [BitConverter]::ToUInt16($sourceImage.GetPropertyItem(274).Value, 0)
        switch ($orientation) {
          2 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::RotateNoneFlipX) }
          3 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate180FlipNone) }
          4 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate180FlipX) }
          5 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate90FlipX) }
          6 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate90FlipNone) }
          7 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate270FlipX) }
          8 { $sourceImage.RotateFlip([Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
      }
      $targetWidth = [Math]::Min(1600, $sourceImage.Width)
      $targetHeight = [Math]::Max(1, [int]($sourceImage.Height * $targetWidth / $sourceImage.Width))
      $bitmap = New-Object Drawing.Bitmap $targetWidth, $targetHeight
      $graphics = [Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([Drawing.Color]::FromArgb(18,20,24))
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)
        $jpegCodec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
        $encoderParameters = New-Object Drawing.Imaging.EncoderParameters 1
        $encoderParameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), ([long]94)
        $bitmap.Save($thumbnailPath, $jpegCodec, $encoderParameters)
        $encoderParameters.Dispose()
      } finally { $graphics.Dispose(); $bitmap.Dispose(); $sourceImage.Dispose() }
      $thumbnailVersion = (Get-FileHash -LiteralPath $thumbnailPath -Algorithm SHA256).Hash.Substring(0,12).ToLower()
      $compiled['thumbnail'] = './asset/thumbnails/' + $entry.id + '.jpg?v=' + $thumbnailVersion
    }
  }
  [pscustomobject]$compiled
}
$content = [ordered]@{profile=$profileData;projects=@($compiledProjects)}
$json = ConvertTo-Json -InputObject $content -Depth 40
$utf8 = New-Object Text.UTF8Encoding $false
[IO.File]::WriteAllText((Join-Path $portfolioRoot 'data/content.json'), $json, $utf8)
[IO.File]::WriteAllText((Join-Path $portfolioRoot 'data/content.js'), ('window.PORTFOLIO_DATA = ' + $json + ';'), $utf8)
Write-Host ('Updated ' + $compiledProjects.Count + ' works. Refresh the browser.')
