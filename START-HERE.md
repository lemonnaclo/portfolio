# 다른 PC에서 이어서 작업하기

## 1. 저장소 전체 가져오기

GitHub 저장소의 Code → Download ZIP으로 내려받아 **전체 압축을 해제**합니다. 또는 Git을 사용하는 PC라면:

```sh
git clone https://github.com/lemonnaclo/portfolio.git
cd portfolio
```

UI 작업에는 **design/desktop-collage/index.html**을 여세요. 배경과 프레임 파일만 확인하려면 **design/desktop-collage/ui/preview.html**을 엽니다. 폰트와 사진 경로가 이어지도록 저장소 전체를 함께 보관합니다.

## 2. 디자인 수정

배경·창·버튼은 design/desktop-collage/ui/images/, 아이콘은 ui/icons/에 있습니다. PNG와 SVG를 함께 제공합니다. PNG를 같은 이름으로 저장하고 브라우저에서 Ctrl+F5로 새로고침하세요. 색·배치·글씨 크기는 design/desktop-collage/collage.css에서 수정합니다.

## 3. 두 PC의 변경 동기화

Git으로 가져왔다면 각 PC에서 작업을 시작하기 전에:

```sh
git pull --ff-only
```

작업을 마친 뒤에는 변경 내용을 확인하고 커밋·푸시합니다.

```sh
git status
git add design/desktop-collage
git commit -m "Update desktop UI design"
git push
```

다음 PC에서는 다시 git pull --ff-only를 실행하면 이어서 작업할 수 있습니다. GitHub에 푸시할 때는 해당 PC에서도 lemonnaclo 계정의 인증이 필요합니다. ZIP으로 받은 사본은 자동으로 동기화되지 않으므로 다시 올리거나 Git으로 복제해 관리합니다.

## 전체 사이트와 내용 수정

현재 공개 사이트 홈은 루트 index.html입니다. design/desktop-collage/index.html을 열어도 같은 홈으로 이동합니다. 홈 구조는 루트 index.html, 스타일·창 동작과 이미지 파일은 design/desktop-collage/에서 수정합니다. 자기소개·경력·도구는 data/profile.json, 프로젝트 제목·썸네일은 data/project-overrides.json에서 수정합니다. Windows에서 JSON 수정 후 update-content.cmd를 실행하면 표시용 데이터가 갱신됩니다.

프로젝트 이미지·영상은 projects/, SCDream 폰트는 font/에 있습니다. Adobe 원본 사이트를 수정할 필요 없이 로컬 HTML과 GitHub 저장소로 작업할 수 있습니다.


공개 주소: https://lemonnaclo.github.io/portfolio/
