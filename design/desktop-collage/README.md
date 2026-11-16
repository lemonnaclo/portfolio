# 공개 사이트 UI 작업 공간

현재 홈은 저장소 루트 **index.html**입니다. 이 폴더의 index.html을 열어도 홈으로 이동합니다. 로컬 HTML과 GitHub Pages에서 같은 소스를 사용합니다.

## 수정할 파일

| 파일 | 용도 |
|---|---|
| ../../index.html | 로그인·부팅·바탕화면 HTML 구조 |
| collage.css | 파스텔 색감·창 프레임·사진 창·모바일 배치 |
| live.css | 프로젝트·프로필 iframe 창과 전체 작업 폴더 배치 |
| collage.js | 로그인·부팅·분류·검색·독립 창 동작 |
| review.css | 공통 기본 배치·SCDream 글꼴 |
| ui/images/*.png / *.svg | 배경·창 프레임·버튼과 편집 원본 |
| ui/icons/*.png / *.svg | 폴더·프로그램 아이콘 |
| ui/preview.html | 교체 파일 목록과 저장 링크 |

PNG는 같은 이름으로 덮어쓰고 Ctrl+F5로 새로고침합니다. SVG를 편집했다면 PNG로 내보내세요. 프레임은 120×120에서 바깥 12px를 모서리와 변으로 사용하는 9-slice이며 가운데는 투명하게 둡니다. 작품별 프레임은 stage-pillowman-frame, stage-living-double-life-frame, stage-waiting-for-you-frame입니다.

프로젝트·학력·경력·연락처는 공통 data/content.js에서 읽습니다. data/profile.json 또는 data/project-overrides.json 수정 후 루트 update-content.cmd를 실행합니다. 모든 파일은 상대 경로 또는 현재 스크립트의 위치를 기준으로 연결되어 다른 PC와 /portfolio/ 하위 주소에서 사용할 수 있습니다.

Stage Design은 분야 폴더로 열리고, 대표 세 작품 사진 창은 바탕화면 진입 시 열립니다. Works 루트에는 분야별 폴더가 있으며 뒤로·앞으로·상위 버튼과 경로 클릭으로 이동합니다. 검색은 현재 폴더 기준입니다. 사진이나 작업 파일을 누르면 상세 페이지가 창 안에서 열립니다. Profile.exe와 Contact.exe는 프로필·연락처에 연결되며 21개 프로젝트를 유지합니다.

데스크톱 창은 변·모서리에서 크기를 조절하고 제목줄로 이동합니다. 최대화는 작업표시줄 위까지 채우고, 제목줄 더블클릭으로도 최대화·복원합니다. 모바일은 화면에 맞는 창 배치를 사용합니다. 다른 PC의 시작 방법과 남은 항목은 루트 START-HERE.md, HANDOFF.md를 참고하세요.
