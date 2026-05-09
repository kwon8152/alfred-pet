# Alfred 공식 홈페이지

주식회사 알프래드 공식 사이트 — 정적 HTML/CSS/JS, GitHub Pages 무료 호스팅.

주요 제품: **ETICAT+** (커피박 업사이클링 고양이 모래) · **REPTIQUETTE** (특수동물 헬스케어 베딩)

## 구조

```
website/
├── index.html        # 메인 페이지 (한 페이지 구성)
├── css/style.css     # 스타일 (반응형)
├── js/i18n.js        # 한/영 번역 + 토글
├── js/main.js        # 모바일 메뉴, 스크롤 효과
├── images/           # 로고, 제품 이미지
└── README.md
```

## 로컬에서 미리보기

이미지/폰트가 정상 로드되도록 간단한 정적 서버로 열어보세요.

**Python (권장)**
```bash
cd website
python -m http.server 8000
# 브라우저에서 http://localhost:8000 열기
```

**Node 사용 시**
```bash
npx serve website
```

또는 그냥 `index.html` 파일을 더블클릭해도 작동합니다 (한/영 토글 포함).

## 내 컴퓨터 VS Code에서 이어서 작업하기 (처음 한 번만)

### 1. 필요한 프로그램 설치
1. **Git** — https://git-scm.com/downloads 에서 다운로드 후 설치 (모든 옵션 기본값)
2. **VS Code** — https://code.visualstudio.com 에서 다운로드 후 설치
3. **Python** (선택) — https://python.org 에서 설치 (로컬 미리보기용, "Add to PATH" 체크)

### 2. 저장소 내려받기 (클론)
바탕화면 등 원하는 폴더에서 마우스 우클릭 → "Git Bash Here" (또는 터미널) 후:
```bash
git clone https://github.com/kwon8152/alfred-pet.git
cd alfred-pet
code .
```
마지막 `code .` 명령으로 VS Code가 이 프로젝트 폴더를 엽니다.

### 3. 추천 확장 설치
프로젝트를 열면 VS Code 우측 하단에 **"이 저장소가 추천 확장 설치를 권장합니다"** 알림이 뜹니다 → **Install** 클릭.
주요 확장:
- **Live Server** — `index.html` 우클릭 → "Open with Live Server" 하면 저장 시 브라우저 자동 새로고침
- **EditorConfig** — 들여쓰기 규칙 자동 적용
- **Prettier** — 코드 정렬 도구
- **Code Spell Checker** — 영문 오타 검사

### 4. 로컬 미리보기
방법 ①: `index.html` 우클릭 → **Open with Live Server** (Live Server 확장 설치 후)
방법 ②: `Ctrl+Shift+B` → "로컬 서버 실행 (Python)" 선택 → http://localhost:8000

### 5. 작업한 내용 GitHub에 올리기
VS Code 좌측 **소스 제어** 아이콘(가지 모양):
1. 변경한 파일 옆 `+` 클릭 (스테이지)
2. 위 입력칸에 변경 설명 작성 → **Commit** 버튼
3. **Sync Changes** (또는 ⋯ 메뉴 → Push) 클릭

### 작업 중인 브랜치 가져오기
이 프로젝트의 진행 중인 브랜치를 받으려면:
```bash
git fetch origin
git checkout claude/setup-vscode-environment-JUozi
```

## 한/영 토글

- 헤더 우측 `KO / EN` 버튼 클릭 → 즉시 전환
- 선택한 언어는 브라우저에 저장(localStorage)되어 다음 방문 시 유지
- 첫 방문자는 브라우저 언어가 영어면 영어, 그 외엔 한국어로 자동 시작

번역 텍스트는 `js/i18n.js` 파일의 `translations` 객체에서 한 곳에서 모두 관리됩니다.
HTML에 `data-i18n="키"` 속성만 있으면 자동 치환됩니다.

## GitHub Pages로 무료 배포하기 (5분)

### 1단계 — GitHub 저장소 만들기

1. https://github.com 로그인
2. 우측 상단 `+` → **New repository**
3. Repository name: `alfred-pet` (원하는 이름)
4. **Public** 선택
5. **Create repository**

### 2단계 — 코드 업로드

**A. 웹에서 드래그앤드롭(가장 쉬움)**
- 만든 저장소 페이지에서 `uploading an existing file` 링크 클릭
- `website` 폴더 안의 모든 파일/폴더를 통째로 드래그
- 하단 **Commit changes** 클릭

**B. Git 명령어 사용**
```bash
cd website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자명/alfred-pet.git
git push -u origin main
```

### 3단계 — GitHub Pages 활성화

1. 저장소 페이지에서 **Settings** 탭
2. 좌측 메뉴 **Pages**
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` / `/ (root)` 선택 → **Save**
5. 1~2분 기다리면 상단에 사이트 주소가 뜸:
   ```
   https://사용자명.github.io/alfred-pet/
   ```

### 4단계 (선택) — 커스텀 도메인 (alfred.pet) 연결

이미 보유 중인 `alfred.pet` 도메인을 연결하려면:

1. **저장소에 `CNAME` 파일 추가**
   ```
   alfred.pet
   ```
   (파일 이름 그대로, 내용 한 줄)

2. **DNS 설정** (도메인 등록업체 콘솔에서)
   ```
   A      @      185.199.108.153
   A      @      185.199.109.153
   A      @      185.199.110.153
   A      @      185.199.111.153
   CNAME  www    사용자명.github.io
   ```

3. **Settings → Pages → Custom domain**에 `alfred.pet` 입력 → Save
4. **Enforce HTTPS** 체크 (DNS 전파 후 1시간 내 가능)

## 연락처 폼 활성화 (Formspree)

문의 폼은 Formspree 무료 플랜으로 동작합니다 (월 50건 제출 무료).

1. https://formspree.io 가입 → **New Form** 생성
2. 알림 받을 이메일 입력 (예: `info@alfred.pet`) → 이메일 인증
3. 발급된 폼 ID 복사 (예: `xrgwabcd`)
4. `index.html` 에서 아래 부분의 `REPLACE_WITH_FORM_ID` 를 폼 ID로 교체:
   ```html
   <form ... action="https://formspree.io/f/REPLACE_WITH_FORM_ID" method="POST">
   ```
5. 커밋 & 푸시 → 자동 배포 완료

설정 전에는 폼 제출 시 사용자에게 "메일로 문의해주세요" 안내가 표시됩니다.

## 콘텐츠 수정 방법

| 수정하고 싶은 것 | 파일 |
|---|---|
| 텍스트 (한/영 모두) | `js/i18n.js` 의 `translations` 객체 |
| 색상·폰트·여백 | `css/style.css` 상단 `:root` 변수 |
| 제품·섹션 추가/제거 | `index.html` |
| 이미지 교체 | `images/` 폴더에 동일 파일명으로 덮어쓰기 |

## 비용

- GitHub 저장소: **무료** (Public)
- GitHub Pages 호스팅: **무료**
- 트래픽: 월 100GB까지 무료
- 도메인(`alfred.pet`)만 별도 연간 비용

## 주의

- GitHub Pages는 **정적 사이트**만 호스팅하므로 결제 처리, 회원가입, DB는 동작하지 않습니다.
- 결제·주문이 필요하면 추후 외부 쇼핑몰(스마트스토어/Shopify) 링크로 연결하거나, Cafe24/Shopify로 별도 구축 권장.
