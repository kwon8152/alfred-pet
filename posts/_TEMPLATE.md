---
title: 글 제목을 여기에 적습니다
date: 2026-05-11
excerpt: 목록 페이지에 1~2줄로 노출되는 요약문입니다. 60~120자 정도가 가장 보기 좋습니다.
cover: /images/eticat-hero.jpg
author: 알프래드
tags: [브랜드, 기술]
lang: ko
draft: false
---

여기서부터 본문을 마크다운으로 작성합니다.

## 소제목은 ## 두 개

문단은 그냥 빈 줄로 구분합니다. **굵게**, *기울임*, [링크](https://alfred.pet), 이런 마크다운 문법 다 됩니다.

- 리스트도
- 자유롭게
- 사용 가능

> 인용문은 이렇게 `>` 로 시작합니다.

이미지는 이렇게:

![설명문](/images/eticat-hero.jpg)

코드는 백틱 세 개로:

```
이런 식으로
```

---

## 사용법 (이 템플릿 파일은 글이 아니라 안내문입니다)

1. 새 글을 쓰려면 이 폴더(`/posts/`)에 `YYYY-MM-DD-slug.md` 이름으로 파일을 추가합니다.
   - 예: `2026-05-15-eticat-review.md`
2. 맨 위 `---` 사이의 메타 정보(title, date, excerpt, cover)는 꼭 채워주세요.
3. `draft: true` 로 두면 목록에 노출되지 않습니다. `false` (또는 줄 자체를 삭제)하면 발행됩니다.
4. 커밋하면 1~2분 안에 자동으로 사이트에 반영됩니다.

파일 이름이 그대로 URL이 됩니다:
- 파일: `2026-05-15-eticat-review.md`
- URL: `https://alfred.pet/blog/post.html?slug=2026-05-15-eticat-review`

이 `_TEMPLATE.md` 파일은 `_` 로 시작하기 때문에 목록에서 자동 제외됩니다 — 안심하고 그대로 두세요.
