# JUN AYOUNG — Portfolio

전아영의 개인 아티스트 사이트와 UI 디자인 작업 파일입니다. HTML·CSS·JavaScript로 구성되어 있으며 로컬 파일로 열어 확인할 수 있습니다.

**다른 PC에서 시작하려면 [START-HERE.md](START-HERE.md)를 먼저 보세요.**

## 시작 파일

| 경로 | 용도 |
|---|---|
| design/desktop-collage/index.html | 최신 파스텔 콜라주 UI 작업 시안 |
| design/desktop-collage/ui/preview.html | UI 교체용 PNG·SVG 목록 |
| index.html | 현재 전체 사이트의 데스크톱 홈 |
| works.html, profile.html, contact.html | 전체 작업·프로필·연락처 |
| project.html | 작업 상세 이미지·영상 |

저장소 전체를 내려받고 압축을 해제한 뒤 해당 HTML을 더블클릭하세요. 별도 패키지 설치나 빌드는 필요하지 않습니다. 최신 UI 시안의 독립 사진 창 3개와 로그인·부팅 흐름은 design/desktop-collage/에서 수정합니다. 전체 프로필·상세 페이지와 새 UI의 통합은 후속 작업으로 남아 있습니다.

## UI 디자인 파일

- design/desktop-collage/ui/images/: 배경·창 프레임·버튼 PNG와 SVG 원본
- design/desktop-collage/ui/icons/: 폴더·프로그램 아이콘
- design/desktop-collage/collage.css: 색상·배치·타이포그래피·모바일 배치
- design/desktop-collage/collage.js: 독립 창 이동·최소화·최대화·닫기
- ui/: 현재 전체 사이트에 연결된 기본 UI 파일

PNG를 같은 이름으로 덮어쓰면 적용됩니다. SVG는 편집 후 PNG로 내보낼 수 있습니다. [UI 작업 안내](design/desktop-collage/README.md)에 파일명과 크기를 정리했습니다. 폰트는 전체 SCDream입니다.

## 콘텐츠 수정

- data/profile.json: 자기소개·연락처·학력·경력·사용 도구·대표 작업
- data/project-overrides.json: 작업 표시 제목·부제·썸네일 지정
- data/case-studies.json: 프로젝트 소개·역할·크레딧
- projects/*/project.json: 수집한 프로젝트 정보와 미디어 목록
- projects/*/assets/: 작업 이미지·영상·웹 표시용 파일

Windows에서 JSON 수정 후 update-content.cmd를 실행합니다. 생성되는 data/content.json과 content.js는 로컬 HTML과 웹에서 함께 사용합니다. 썸네일은 thumbnailFile, 상세 대표 이미지는 coverFile로 따로 관리합니다. 편집용 썸네일 PNG는 각 프로젝트 assets/thumbnails/selected.png에 있습니다.

## 작업과 자료

Stage Design → Production Design → 3D → VMD 순서이며, 주 작업은 필로우맨·살아있는 이중생 각하·당신을 기다리고 있어의 세 무대 디자인 작품입니다. 기존 21개 프로젝트를 보존했습니다. 확인된 고해상도 원본은 각 프로젝트 assets/high-res/, 웹 표시용은 assets/web/에 있습니다. CAVE RAIDER는 제공된 1080p MP4로 재생합니다. 원본 사이트의 페이지·이미지·설정은 수정하지 않았습니다.

이 저장소는 다른 PC에서도 이어서 작업하기 위한 소스입니다. GitHub Pages 배포 설정은 아직 하지 않았습니다.
