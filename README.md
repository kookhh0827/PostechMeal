# 포스텍 식당 정보 사이트 프로젝트

![Main Image](public/favicon/android-chrome-512x512.png)

## 프로젝트 소개

이 프로젝트는 오픈 소스로 진행되며, 포스텍 내의 식당 정보를 한 곳에 모으기 위해 시작되었습니다. 포스텍 구성원의 알찬 메뉴 선정에 도움을 주는 것이 목표입니다. 식당 리뷰, 메뉴 리뷰, 커뮤니티 기능을 등을 통해서 건전한 학내 식문화 확산을 추구하고자 합니다. 이 프로젝트의 개발 및 기획에 참여하고 싶으신 분은 누구든지 환영입니다.

## 기술 스택

이 프로젝트의 주요한 기술 스택은 다음과 같습니다.

- ⚡️ Next.js 14 with App Router
- ⚛️ React 18
- 🛢️ Supabase and Supabase.js — Database SaaS and framework
- ✨ TypeScript
- 💨 Tailwind CSS 3 — Configured with CSS Variables to extend the **primary** color
- 🃏 Jest — Configured for unit testing
- 📏 ESLint — Find and fix problems in your code, also will **auto sort** your imports
- 💖 Prettier — Format your code consistently
- 🐶 Husky & Lint Staged — Run scripts on your staged files before they are committed
- 🤖 Conventional Commit Lint — Make sure you & your teammates follow conventional commit

## 시작하기

### 1. Repository 클론 및 배포

1. 이 Repository를 클론

   ![Use as template](https://user-images.githubusercontent.com/55318172/129183039-1a61e68d-dd90-4548-9489-7b3ccbb35810.png)

2. Vercel을 통해 Deploy

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/kookhh0827/PostechMeal)

### 2. Dependencies 설치

**pnpm** 을 사용하시는 것을 추천합니다.

```bash
pnpm install
```

### 3. Local에서 Development 서버 테스트

다음 커맨드로 local 환경에서 테스트할 수 있습니다.

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 에서 작동하는 서버를 확인하실 수 있습니다.

### 4. Commit Message Convention

이 프로젝트는 다음 Commit Convention을 따릅니다. [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## 로드맵

- [x] 로그인, 로그아웃 기능 구현
- [x] 식당 별 리뷰 및 좋아요 기능 구현
- [x] 고정 메뉴 리뷰 기능 구현
- [ ] 리뷰 수정 및 삭제 기능 구현
- [ ] 식단표 메뉴 아이템화 및 평가 기능 구현
- [ ] 회원 정보 수정 기능 구현
- [ ] 리뷰 대댓글 기능 구현

## 문의 및 제안

개발에 합류하고 싶거나, 제안하실 사항이 있는 경우 kookhh0827@postech.ac.kr 로 메일 바랍니다.
