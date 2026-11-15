# 최신 UI 디자인 작업 공간

저장소 전체를 내려받은 상태에서 **index.html**을 더블클릭하면 됩니다. npm 설치나 빌드가 필요하지 않습니다. 프로젝트 사진과 폰트는 저장소의 공통 폴더를 상대 경로로 읽습니다.

## 바로 수정할 파일

| 파일 | 역할 |
|---|---|
| index.html | 로그인·부팅·바탕화면 구조 |
| collage.css | 파스텔 색감, 창 프레임, 배치, 모바일 규칙 |
| collage.js | 독립 사진 창 3개의 이동·최소화·최대화·닫기 |
| review.css | 공통 기본 배치와 글꼴 |
| ui/images/*.png | 배경·프레임·제목 표시줄·버튼의 실제 연결 파일 |
| ui/images/*.svg | 같은 디자인의 벡터 편집 원본 |
| ui/icons/*.png / *.svg | 분야별 폴더·프로그램 아이콘 |
| ui/preview.html | PNG·SVG 파일 목록과 저장 링크 |

**PNG는 같은 이름으로 덮어쓰고 Ctrl+F5로 새로고침**하세요. SVG를 편집한 뒤 PNG로 내보내도 됩니다. 파일명을 바꾸면 collage.css와 HTML/JS의 경로도 함께 바꿉니다. 클릭 동작을 이어가려면 HTML의 id/data 속성은 유지합니다.

## 작품별 창 프레임

- ui/images/stage-pillowman-frame.png: 필로우맨
- ui/images/stage-living-double-life-frame.png: 살아있는 이중생 각하
- ui/images/stage-waiting-for-you-frame.png: 당신을 기다리고 있어

각 PNG 옆에 SVG가 있습니다. 원본 크기는 120×120이며 바깥 12px를 모서리와 테두리로 사용하는 9-slice입니다. 가운데는 투명하게 두고 제목·작품명·버튼은 이미지에 포함하지 않습니다.

배경은 wallpaper-desktop.png(1920×1080), wallpaper-mobile.png(1080×1920), login-background.png(1920×1080)입니다. 제목 표시줄·부팅 진행 막대·로그인 버튼·사진 둘레 바탕도 같은 images 폴더에 있습니다.

## 현재 연결 상태

Stage Design 폴더는 실제 무대 작업 세 작품을 각각 독립 사진 창으로 엽니다. 다른 분야에서는 확정된 썸네일을 볼 수 있습니다. Profile·Contact 창은 UI 검토용이며 전체 프로필과 프로젝트 상세 페이지를 이 새 데스크톱에 연결하는 작업은 후속 통합 단계입니다. 전체 사이트의 내용은 저장소 루트의 HTML에 있습니다.

썸네일 선택은 01-A·07-A, 08은 과자·오렌지 배경 캔·금색 볼의 세로 3컷으로 반영되어 있습니다. 비교 화면의 왼쪽은 교체 전, 오른쪽은 현재 선택한 이미지입니다.
