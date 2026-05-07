# Alfred 공식 홈페이지

주식회사 알프래드 공식 사이트 — 정적 HTML/CSS/JS, GitHub Pages 무료 호스팅.

주요 제품: **ETICAT+** (커피박 업사이클링 고양이 모래) · **REPTICAT** (특수동물 헬스케어 베딩)

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
