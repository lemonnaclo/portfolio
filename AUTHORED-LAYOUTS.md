# PDF 기반 작업 상세 페이지

네 작품은 원본 페이지 전체 나열에서 **원본 편집 스타일을 따른 HTML 본문과 CSS 이미지 영역 표시**로 전환했습니다. 원본은 `포폴0124/Portfolio250804.pdf`이며 PNG는 비교·보관용이자 이미지 표시 원본입니다.

| 작업 | 원본 쪽 | 현재 페이지 | 본문·이미지 영역 수정 |
| --- | --- | --- | --- |
| 살아있는 이중생 각하 | 3–11 | `living-double-life.html` | `tools/build_remaining_editorial.py` |
| 당신을 기다리고 있어 | 12–18 | `waiting-for-you.html` | `tools/build_waiting.py` |
| 필로우맨 | 19–27 | `pillowman.html` | 해당 HTML 직접 수정 |
| 정상영업 합니다 | 28–34 | `normal-business.html` | `tools/build_remaining_editorial.py` |

## 스타일과 상호작용

- `pillowman.css`: 네 작품의 공통 폰트·제목·이미지·확대창과 필로우맨 배치. 수정 시 네 작품을 확인합니다.
- `waiting-for-you.css`: 당신을 기다리고 있어의 배경색 `#2d2f41`, 콘셉트·장면·맵핑 배치.
- `editorial.css`: 이중생 각하·정상영업의 배치·모바일 대응.
- `pillowman.js`, `waiting-for-you.js`, `editorial.js`: 이미지 확대·닫기·확대 토글.
- `project.js`: 기존 작업물 URL을 전용 HTML로 연결.

HTML의 `region-data` JSON에서 `x`, `y`, `w`, `h`는 원본 픽셀 좌표입니다. 3200px 너비 페이지에서 영역을 지정하고 비율·위치로 보여 주며 PNG를 잘라 덮어쓰지 않습니다. `editorial.js`는 개별 고해상도 사진도 표시하도록 `src`, `sw`를 함께 사용합니다.

```sh
python tools/build_waiting.py
python tools/build_remaining_editorial.py
```

Python 표준 라이브러리만 사용합니다. 첫 명령은 `waiting-for-you.html`과 JS를, 두 번째는 이중생 각하·정상영업 HTML 두 개를 갱신합니다. 생성 HTML만 바꾸면 다음 실행에 덮어써지므로 빌더도 맞춰야 합니다. CSS와 `editorial.js`는 덮어쓰지 않습니다.

`build_waiting.py`는 `waiting-for-you.js`를 `pillowman.js`에서 복사해 이미지 경로를 바꿉니다. 개별 JS를 수정할 때 이 동작도 고려하세요.

## 원본과 데이터 보관

프로젝트 `assets/authored-layout/page-XX.png`에 3200px 너비 PNG를 보관하고 `layout.json`에 순서·크기·해시·추출 텍스트를 기록했습니다. `assets/high-res/`, `assets/web/`의 개별 이미지도 유지합니다.

새 원본으로 교체하거나 크기를 바꾸면 영역 좌표·본문·해시도 맞춰야 합니다. `layout.json` 수정 후 `update-content.cmd`만 실행해도 전용 HTML 본문과 좌표는 자동 변경되지 않습니다. 표지·썸네일은 별도 콘텐츠 설정입니다.

PDF의 프로필·주소가 있는 1–2쪽, 연락처 35쪽은 작업 상세에 포함하지 않았습니다. 원본 전체 PDF가 저장소에 있다고 가정하지 말고 페이지 PNG와 기록 텍스트를 먼저 확인하세요.
