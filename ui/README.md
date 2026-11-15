# PNG / SVG로 직접 교체하는 UI

기본 연결은 **PNG**입니다. 모든 교체 자리에 PNG와 같은 이름의 SVG 원본을 함께 저장했습니다. 별도의 변환 프로그램은 필요하지 않습니다.

## PNG로 작업할 때

1. 아래 표의 PNG를 Photoshop 등에서 엽니다. 투명 더미는 빈 투명 캔버스처럼 보이는 것이 정상입니다.
2. 지정된 캔버스 크기에 디자인하고, **같은 경로·같은 이름의 PNG**로 덮어씁니다. 테두리·아이콘은 투명 배경을 유지하세요.
3. `../index.html`을 열어 Ctrl+F5로 새로고침합니다. JSON 수정이나 `update-content.cmd` 실행은 필요 없습니다.

SVG만 수정해도 연결된 PNG가 자동으로 바뀌지는 않습니다. SVG로 작업했다면 PNG로 내보내 덮어쓰거나 아래 SVG 연결 방법을 사용하세요.

## SVG로 작업할 때

동일 폴더의 같은 이름 `.svg` 파일을 Illustrator 등에서 편집할 수 있습니다. 그대로 SVG를 사용하려면 `theme.css` 맨 위에서 해당 이미지 경로의 `.png`를 `.svg`로, 아이콘은 `config.js`에서 확장자를 바꾸세요. 아바타는 `index.html`의 `avatar.png` 두 곳도 변경합니다. PNG 파일의 확장자만 SVG로 바꾸면 동작하지 않습니다.

## 교체 파일과 크기

아래 모든 PNG 옆에 같은 이름의 SVG도 있습니다. `preview.html`에는 PNG·SVG 열기/저장 링크를 함께 넣었습니다.

| 기본 연결 파일 | 캔버스 크기(px) | 용도 |
|---|---:|---|
| `images/wallpaper-desktop.png` | 1920×1080 | PC 바탕화면 |
| `images/wallpaper-mobile.png` | 1080×1920 | 모바일 바탕화면 |
| `images/login-background.png` | 1920×1080 | 로그인 배경 |
| `images/window-frame.png` | 120×120 | 작업 팝업 테두리 |
| `images/login-frame.png` | 120×120 | 로그인 패널 테두리 |
| `images/pinned-frame.png` | 120×120 | 주 작업 패널 테두리 |
| `images/titlebar-active.png` | 1000×48 | 활성 창 제목 표시줄 |
| `images/titlebar-inactive.png` | 1000×48 | 비활성 창 제목 표시줄 |
| `images/button-primary.png` | 400×60 | 로그인·일반 버튼 바탕 |
| `images/taskbar.png` | 1920×64 | 하단 작업 표시줄 |
| `images/start-button.png` | 160×60 | 시작 버튼 바탕 |
| `images/start-menu.png` | 360×600 | 시작 메뉴 바탕 |
| `images/window-surface.png` | 1200×800 | 파일 탐색기·Contact·Readme 안쪽 바탕 |
| `images/avatar.png` | 256×256 | 아바타 |
| `images/control-minimize.png` | 64×64 | 최소화 |
| `images/control-maximize.png` | 64×64 | 최대화 |
| `images/control-close.png` | 64×64 | 닫기 |
| `icons/folder.png` | 128×128 | folder |
| `icons/stage.png` | 128×128 | stage |
| `icons/production.png` | 128×128 | production |
| `icons/3d.png` | 128×128 | 3d |
| `icons/vmd.png` | 128×128 | vmd |
| `icons/profile.png` | 128×128 | profile |
| `icons/contact.png` | 128×128 | contact |
| `icons/works.png` | 128×128 | works |
| `icons/readme.png` | 128×128 | readme |
| `icons/start.png` | 128×128 | start |

## 배경과 투명 더미

현재 승인한 화면을 유지하려고 배경·프레임·바탕 슬롯은 투명 PNG로 두었습니다. 기존 디자인은 `theme.css`에 있으며, 새 이미지가 그 위에 표시됩니다. 아이콘·아바타·창 버튼은 현재 그림이 들어 있습니다.

배경을 새로 만들었다면 `theme.css` 맨 위의 `--ui-decoration-opacity: 1`을 `0`으로 바꾸면 기존 큰 이름·원 장식이 사라집니다. 배경은 cover로 채워져 화면 비율에 따라 가장자리가 잘립니다. PC와 모바일 배경은 각각 별도 파일입니다.

## 늘어나는 팝업 테두리

`window-frame.png`, `login-frame.png`, `pinned-frame.png`는 120×120 아트보드의 바깥 12px를 테두리로 사용합니다. 네 모서리를 유지하고 가운데 선만 늘리는 9-slice 방식입니다. 가운데 96×96은 투명하게 두세요.

`templates/window-frame-guides.png` 또는 `.svg`를 별도 가이드 레이어로 사용하세요. 분홍 가이드와 글자는 최종 이미지에 포함하지 않습니다. 만든 테두리는 `images/window-frame.png` 등에 저장합니다. 원본 크기나 두께를 바꾸면 `theme.css`의 `--ui-frame-slice`, `--ui-frame-width`도 맞춥니다.

## 이미지와 기능의 구분

- 배경 이미지에 실제 메뉴·버튼·본문을 그려 넣지 마세요. 글자와 클릭 기능은 HTML이 담당합니다.
- 제목 표시줄·일반 버튼·작업 표시줄 그림에는 텍스트를 넣지 않습니다. 최소화·최대화·닫기 PNG는 기호를 포함한 버튼 전체 그림입니다.
- `theme.css`: 색상·프레임·버튼·글씨 크기·모바일 스타일. 이미지 경로는 이 파일 기준입니다.
- `config.js`: 아이콘 파일 연결. 경로는 index.html 기준입니다.
- `asset-manifest.json`: 권장 크기와 용도 목록. 안내용이며 화면을 제어하지 않습니다.
- `desktop.js`, `desktop.css`, HTML의 id/data 속성은 기능·기본 배치이므로 유지하세요.
- 작품 이미지·영상·본문과 Profile 연표는 기존 폴더에 그대로 있습니다. UI 파일 교체와 별개입니다.

파일명은 대소문자를 유지하세요. GitHub Pages에서도 같은 경로를 그대로 사용합니다.
