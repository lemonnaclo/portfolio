(async () => {
  'use strict';
  const requested = new URLSearchParams(location.search);
  const editorialPages = {
    'stage-pillowman': './pillowman.html',
    'stage-waiting-for-you': './waiting-for-you.html'
  };
  if (Object.hasOwn(editorialPages, requested.get('id'))) {
    const destination = new URL(editorialPages[requested.get('id')], location.href);
    if (requested.get('embedded') === '1') destination.searchParams.set('embedded', '1');
    destination.hash = location.hash;
    location.replace(destination.href);
    return;
  }
  const { esc, loadData, projectUrl, assetUrl, reveal } = window.Portfolio;
  const target = document.getElementById('project');
  try {
    const data = await loadData();
    const id = new URLSearchParams(location.search).get('id');
    const project = data.projects.find(item => item.id === id);
    if (!project) { target.innerHTML='<div class="project-error"><h1 class="project-title">작업을 찾지 못했습니다.</h1><p>작업 목록에서 다시 선택해 주세요.</p></div>'; document.getElementById('project-navigation').hidden=true; return; }
    document.title = project.displayTitle + ' — Jun Ayoung';
    const imageRecords = (project.media || []).filter(item => item.type === 'image' && item.path).map(item => ({url:assetUrl(project,item.path),displayUrl:item.displayPath?assetUrl(project,item.displayPath):assetUrl(project,item.path),alt:item.alt || project.displayTitle}));
    const authoredPages = project.layout?.mode === 'original-pages' ? project.layout.pages : null;
    let images = imageRecords;
    if (project.coverUrl) images = [{url:project.coverUrl,displayUrl:project.coverDisplayUrl || project.coverUrl,alt:project.displayTitle}, ...imageRecords.filter(item => item.url !== project.coverUrl)];
    if (authoredPages?.length) images = authoredPages.map(page => ({url:assetUrl(project,page.path), displayUrl:assetUrl(project,page.path), alt:project.displayTitle + ' 원본 편집 ' + page.sourcePage + '쪽', width:page.width, height:page.height}));
    const mediaButton = (image,index) => '<button class="media-open" type="button" data-gallery-index="' + index + '" aria-label="' + esc(project.displayTitle) + ' 이미지 ' + (index+1) + ' 크게 보기"><img src="' + esc(image.displayUrl || image.url) + '" alt="' + esc(image.alt) + '"' + (index ? ' loading="lazy"' : '') + ' decoding="async"></button>';
    const meta = [];
    if(project.roleLabel || project.role) meta.push(['Role',project.roleLabel || project.role]);
    if(project.date || project.year) meta.push(['Year',project.date || project.year]);
    if(project.context) meta.push(['Project',project.context]);
    if(project.tools?.length) meta.push(['Tools',project.tools.join(' / ')]);
    if(project.credits) meta.push(['Credits',project.credits]);
    const summary = project.summary || project.description || project.subtitle || '';
    const detailText = !project.sections?.length && project.detail && project.detail !== summary ? '<p>' + esc(project.detail) + '</p>' : '';
    const localVideos=(project.media||[]).filter(item=>item.type==='video'&&item.path);
    const localVideoHtml=localVideos.map(item=>'<div class="project-video-block"><video class="project-video" controls playsinline preload="metadata" aria-label="'+esc(project.displayTitle)+' 영상"><source src="'+esc(assetUrl(project,item.path))+'" type="'+esc(item.mimeType||'video/mp4')+'">동영상을 재생할 수 없습니다. <a href="'+esc(assetUrl(project,item.path))+'" download>영상 다운로드</a></video></div>').join('');
    const videoItems=(project.media||[]).filter(item=>item.type==='video-embed');
    const videoLink = videoItems.length && project.sourceRoute ? '<div class="video-source"><p>' + (images.length ? '이 작업의 영상도 볼 수 있습니다.' : esc(project.displayTitle) + ' · 시네마틱 영상') + '</p><a href="https://junaaayoung.myportfolio.com/' + encodeURIComponent(project.sourceRoute) + '" target="_blank" rel="noopener noreferrer">영상이 있는 원본 프로젝트 보기 ↗</a></div>' : '';
    const heroHtml=images.length?'<div class="project-hero">'+mediaButton(images[0],0)+'</div>':localVideos.length?'<div class="project-hero">'+localVideoHtml+'</div>':'<div class="project-hero no-image-project"><div class="art-placeholder"><span>'+esc(project.displayTitle)+'</span><small>'+esc(project.subtitle||'')+'</small></div></div>';
    if (!authoredPages?.length) target.innerHTML = '<header><p class="project-kicker">' + esc(project.category) + (project.year ? ' / ' + esc(project.year) : '') + '</p><h1 class="project-title">' + esc(project.displayTitle) + '</h1>' + (project.subtitle ? '<p class="project-subtitle">' + esc(project.subtitle) + '</p>' : '') + '</header>' + heroHtml + '<section class="project-overview" aria-label="작업 소개"><div class="project-summary">' + esc(summary) + detailText + '</div><dl class="project-meta">' + meta.map(pair=>'<dt>'+esc(pair[0])+'</dt><dd>'+esc(pair[1])+'</dd>').join('') + '</dl></section>' + (project.sections?.length ? '<section class="project-story" aria-label="작업 이야기">' + project.sections.map(item=>'<div class="story-item"><h2>'+esc(item.title)+'</h2><p>'+esc(item.text)+'</p></div>').join('') + '</section>' : '') + (images.length>1 ? '<section class="project-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">Images & process</h2>' + images.slice(1).map((image,index)=>'<figure class="gallery-item">'+mediaButton(image,index+1)+'<figcaption>'+String(index+2).padStart(2,'0')+' / '+String(images.length).padStart(2,'0')+'</figcaption></figure>').join('') + '</section>' : '') + (images.length&&localVideos.length?'<section class="project-gallery"><h2>Video</h2>'+localVideoHtml+'</section>':'') + videoLink;
    if (authoredPages?.length) {
      document.documentElement.classList.add('has-authored-layout');
      target.classList.add('authored-layout');
      target.innerHTML = '<h1 class="sr-only">' + esc(project.displayTitle) + '</h1><section class="authored-pages" aria-label="' + esc(project.displayTitle) + ' 원본 편집 페이지">' + authoredPages.map((page,index) => '<figure class="authored-page" data-source-page="' + page.sourcePage + '"><button class="media-open" type="button" data-gallery-index="' + index + '" aria-label="' + esc(images[index].alt) + ' 크게 보기"><img src="' + esc(images[index].url) + '" width="' + page.width + '" height="' + page.height + '" alt="' + esc(images[index].alt) + '"' + (index ? ' loading="lazy"' : ' fetchpriority="high"') + ' decoding="async"></button><figcaption class="sr-only">' + esc(page.text) + '</figcaption></figure>').join('') + '</section>';
    }
    const index=data.projects.indexOf(project),prev=data.projects[(index-1+data.projects.length)%data.projects.length],next=data.projects[(index+1)%data.projects.length];
    document.getElementById('project-navigation').innerHTML='<a href="'+projectUrl(prev)+'"><small>← Previous work</small>'+esc(prev.displayTitle)+'</a><a href="'+projectUrl(next)+'"><small>Next work →</small>'+esc(next.displayTitle)+'</a>';
    const dialog=document.getElementById('lightbox'),dialogImage=document.getElementById('lightbox-image');
    const zoomButton=document.getElementById('lightbox-zoom');
    function resetZoom(){dialog.classList.remove('is-zoomed');zoomButton.setAttribute('aria-pressed','false');zoomButton.textContent='원본 크기로 보기';}
    zoomButton.addEventListener('click',()=>{const zoomed=dialog.classList.toggle('is-zoomed');zoomButton.setAttribute('aria-pressed',String(zoomed));zoomButton.textContent=zoomed?'화면에 맞추기':'원본 크기로 보기';});
    let active=0;
    function showImage(index){resetZoom();active=(index+images.length)%images.length;dialogImage.src=images[active].url;dialogImage.alt=images[active].alt;document.getElementById('lightbox-count').textContent=String(active+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');document.getElementById('lightbox-caption').textContent=authoredPages?.length?images[active].alt:project.displayTitle;document.getElementById('lightbox-prev').disabled=images.length<2;document.getElementById('lightbox-next').disabled=images.length<2;}
    target.addEventListener('click',event=>{const button=event.target.closest('[data-gallery-index]');if(!button)return;showImage(Number(button.dataset.galleryIndex));dialog.showModal();document.body.classList.add('dialog-open');});
    document.getElementById('lightbox-close').addEventListener('click',()=>dialog.close());
    document.getElementById('lightbox-prev').addEventListener('click',()=>showImage(active-1));
    document.getElementById('lightbox-next').addEventListener('click',()=>showImage(active+1));
    dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
    dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showImage(active-1)}if(event.key==='ArrowRight'){event.preventDefault();showImage(active+1)}});
    reveal();
  } catch(error) { target.innerHTML='<p class="project-error error">작업을 읽지 못했습니다. 페이지를 새로고침해 주세요.</p>';console.error(error); }
})();
