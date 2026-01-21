# 배포 가이드 - 한국형 FIRE 계산기

이 문서는 한국형 FIRE 계산기를 Google, Naver, Daum, Bing 검색 엔진에 배포하는 방법을 안내합니다.

## 1. Vercel에 배포 (권장)

### 1.1 Vercel 계정 생성 및 프로젝트 연결

1. [Vercel](https://vercel.com)에 가입/로그인
2. "New Project" 클릭
3. GitHub/GitLab/Bitbucket 저장소 연결
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 1.2 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_NAVER_VERIFICATION=your-naver-verification-code
```

### 1.3 배포 실행

- 저장소에 푸시하면 자동 배포됩니다
- 또는 Vercel 대시보드에서 "Deploy" 버튼 클릭

## 2. 검색 엔진 제출

### 2.1 Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → URL 접두어 입력 (예: `https://your-domain.vercel.app`)
3. 소유권 확인:
   - HTML 태그 방식: `NEXT_PUBLIC_GOOGLE_VERIFICATION` 환경 변수에 코드 입력
   - 또는 HTML 파일 업로드
4. 확인 후:
   - 좌측 메뉴 → "Sitemaps" → `https://your-domain.vercel.app/sitemap.xml` 제출
   - "URL 검사" 도구로 사이트 크롤링 요청

### 2.2 Naver Search Advisor

1. [Naver Search Advisor](https://searchadvisor.naver.com) 접속
2. 사이트 등록 → 사이트 URL 입력
3. 소유권 확인:
   - HTML 메타 태그: `NEXT_PUBLIC_NAVER_VERIFICATION` 환경 변수에 코드 입력
   - 또는 HTML 파일 업로드
4. 확인 후:
   - "요청" → "사이트맵 제출" → `https://your-domain.vercel.app/sitemap.xml` 제출
   - "수집 요청" 클릭

### 2.3 Daum 검색 등록

1. [Daum 검색 등록](https://register.search.daum.net/index.daum) 접속
2. 사이트 등록 → URL 입력
3. 사이트맵 제출: `https://your-domain.vercel.app/sitemap.xml`

### 2.4 Bing Webmaster Tools

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. 사이트 추가 → URL 입력
3. 소유권 확인 (HTML 메타 태그 또는 XML 파일)
4. 확인 후:
   - "Sitemaps" → `https://your-domain.vercel.app/sitemap.xml` 제출
   - "URL 제출" 도구로 사이트 크롤링 요청

## 3. SEO 최적화 체크리스트

- [x] 메타 태그 설정 (title, description, keywords)
- [x] Open Graph 태그 설정
- [x] Twitter Card 설정
- [x] sitemap.xml 생성
- [x] robots.txt 생성
- [x] 한국어 언어 설정 (`lang="ko"`)
- [ ] 구조화된 데이터 (JSON-LD) 추가 (선택사항)
- [ ] Google Analytics 설정 (선택사항)

## 4. 추가 최적화 (선택사항)

### 4.1 Google Analytics 추가

`src/app/layout.tsx`에 다음 코드 추가:

```tsx
import Script from 'next/script'

// body 태그 내부에 추가
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 4.2 구조화된 데이터 추가

`src/app/page.tsx`에 JSON-LD 스크립트 추가:

```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "한국형 파이어(FIRE) 계산기",
  "description": "연금저축, IRP, ISA 절세 최적화 시뮬레이터",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
}

// head에 추가
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

## 5. 배포 후 확인 사항

1. 사이트 접속 확인: `https://your-domain.vercel.app`
2. sitemap 접속 확인: `https://your-domain.vercel.app/sitemap.xml`
3. robots.txt 접속 확인: `https://your-domain.vercel.app/robots.txt`
4. 모바일 반응형 확인
5. 페이지 속도 확인 (Google PageSpeed Insights)

## 6. 문제 해결

### 배포 실패 시
- `npm run build` 로컬에서 실행하여 빌드 오류 확인
- Vercel 로그 확인

### 검색 엔진에 노출되지 않을 때
- sitemap.xml이 정상 작동하는지 확인
- robots.txt가 크롤링을 차단하지 않는지 확인
- 검색 엔진 크롤링 대기 (보통 1-2주 소요)

## 7. 참고 링크

- [Next.js 배포 문서](https://nextjs.org/docs/deployment)
- [Vercel 문서](https://vercel.com/docs)
- [Google Search Console 도움말](https://support.google.com/webmasters)
- [Naver Search Advisor 가이드](https://searchadvisor.naver.com/guide)
