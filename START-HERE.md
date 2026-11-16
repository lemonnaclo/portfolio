# 다른 PC에서 이어서 작업하기

2026-11-16 정리. 공개 배포와 이어서 작업할 소스의 기준은 GitHub `main`입니다.

- [공개 사이트](https://lemonnaclo.github.io/portfolio/)
- [GitHub 저장소](https://github.com/lemonnaclo/portfolio)
- [변경 내역·확인 항목·다음 작업](HANDOFF.md)
- [PDF 기반 상세 페이지 수정 방법](AUTHORED-LAYOUTS.md)

## 새 PC에서 시작

Git과 Python 3이 있으면 다음 명령으로 시작합니다. 사이트 실행에는 패키지 설치나 빌드가 필요 없습니다.

```sh
git clone https://github.com/lemonnaclo/portfolio.git
cd portfolio
git switch main
git pull --ff-only origin main
python -m http.server 8767 --bind 127.0.0.1
```

Windows에서 `python`을 찾지 못하면 `py`를 사용합니다. 브라우저에서 http://127.0.0.1:8767/ 를 엽니다. 서버 터미널은 열어 두고 종료할 때 Ctrl+C를 누릅니다. 다른 명령은 별도 터미널에서 실행합니다.

HTML 더블클릭으로도 일부 화면을 볼 수 있지만, 공개 환경과 같은 데이터·경로·iframe 동작 확인에는 로컬 서버를 권장합니다. 폰트와 이미지가 연결되므로 저장소 전체가 필요합니다.

이미 복제한 PC는 작업 전에 `git status`로 변경을 확인하고 `git pull --ff-only origin main`을 실행합니다. 병합 오류가 나면 기존 변경을 먼저 커밋하거나 별도로 보관합니다. `reset --hard`로 덮어쓰지 않습니다.

Code → Download ZIP으로 확인할 수도 있지만 ZIP 사본은 Git으로 동기화되지 않습니다. 계속 수정할 PC에는 Git 복제를 권장합니다. 푸시하려면 그 PC에서 GitHub 인증과 Git 작성자 이름·이메일 설정이 필요합니다. 비밀번호·토큰은 저장소 파일에 넣지 않습니다.

## 수정할 파일

| 대상 | 파일 |
| --- | --- |
| 홈 구조·로그인·바탕화면 | `index.html` |
| 창 조작·폴더 탐색 | `design/desktop-collage/collage.js`, `live.css` |
| 홈 색상·프레임·모바일 배치 | `design/desktop-collage/collage.css`, `review.css` |
| UI 이미지·아이콘 | `design/desktop-collage/ui/` |
| 필로우맨 | `pillowman.html`, `pillowman.css`, `pillowman.js` |
| 당신을 기다리고 있어 | `tools/build_waiting.py`, `waiting-for-you.css`, `waiting-for-you.js` |
| 이중생 각하·정상영업 | `tools/build_remaining_editorial.py`, `editorial.css`, `editorial.js` |
| 나머지 17개 작업 상세 | `project.js`, `project-layout.css` (기본 스타일 `styles.css`) |
| 프로필·경력·연락처 | `data/profile.json` |
| 작업 제목·썸네일 | `data/project-overrides.json` |
| 프로젝트 정보·미디어 | `projects/*/project.json`, `data/projects.json`, `data/case-studies.json` |

생성형 상세 페이지는 빌더에서 본문·이미지 영역을 수정하고 아래 명령으로 갱신합니다. Python 표준 라이브러리만 사용하며 CSS는 별도로 직접 수정합니다.

```sh
python tools/build_waiting.py
python tools/build_remaining_editorial.py
```

프로필·프로젝트 JSON 수정 후에는 Windows에서 `update-content.cmd` 또는 다음 명령을 실행하고 생성된 `data/content.json`, `data/content.js`도 커밋합니다. 이 명령은 편집형 상세 HTML을 생성하지 않습니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\refresh-content.ps1
```

## 확인하고 저장

Ctrl+F5로 새로고침하고 [HANDOFF.md](HANDOFF.md)의 확인 순서를 따릅니다. Node가 있다면 문법 검사도 실행합니다. Node는 사이트 실행에는 필요 없습니다.

```sh
node --check design/desktop-collage/collage.js
node --check project.js
node --check editorial.js
git diff --check
git diff
git status
```

변경 파일을 지정해서 저장·푸시합니다. 아래 `<변경한 파일 경로>`는 실제 파일명으로 바꿉니다.

```sh
git add <변경한 파일 경로>
git commit -m "Describe the portfolio update"
git push origin main
```

`main` 푸시는 공개 배포로 이어집니다. [Actions](https://github.com/lemonnaclo/portfolio/actions)의 `pages build and deployment` 성공과 공개 사이트를 확인합니다. 검토용 변경은 별도 브랜치에서 진행해도 됩니다.

이전 PC의 `codex/interactive-desktop-windows`, `codex/pillowman-web-layout` 브랜치를 새 작업 기준으로 쓸 필요는 없습니다. 필요한 변경은 `main`에 합쳐 배포하며, 이전 PC의 경로나 실행 중이던 서버에 의존하지 않습니다.
