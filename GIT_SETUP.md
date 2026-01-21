# Git 및 Vercel 배포 가이드

## 1단계: Git 저장소 설정

프로젝트 디렉토리에서 다음 명령어를 실행하세요:

```bash
cd "d:\Program Files\Fire Simulator with stocks"

# Git 사용자 정보 설정 (로컬 저장소용)
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit: Korean FIRE Simulator with SEO optimization"
```

## 2단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 "+" 버튼 → "New repository" 클릭
3. 저장소 이름 입력 (예: `korean-fire-simulator`)
4. Public 또는 Private 선택
5. "Create repository" 클릭
6. 생성된 저장소의 URL 복사 (예: `https://github.com/your-username/korean-fire-simulator.git`)

## 3단계: 원격 저장소 연결 및 푸시

```bash
# 원격 저장소 추가
git remote add origin https://github.com/your-username/korean-fire-simulator.git

# 브랜치 이름을 main으로 변경 (필요한 경우)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 4단계: Vercel 배포

1. [Vercel](https://vercel.com)에 가입/로그인
2. "Add New..." → "Project" 클릭
3. "Import Git Repository"에서 GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: Next.js (자동 감지됨)
   - Root Directory: `./`
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
5. "Environment Variables" 섹션에서 다음 변수 추가:
   - `NEXT_PUBLIC_BASE_URL`: 배포 후 자동 생성된 URL (예: `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION`: (나중에 Google Search Console에서 받은 코드)
   - `NEXT_PUBLIC_NAVER_VERIFICATION`: (나중에 Naver Search Advisor에서 받은 코드)
6. "Deploy" 클릭

## 5단계: 배포 확인

배포가 완료되면:
- Vercel 대시보드에서 배포된 URL 확인
- 브라우저에서 사이트 접속 테스트
- `https://your-app.vercel.app/sitemap.xml` 접속 확인
- `https://your-app.vercel.app/robots.txt` 접속 확인

## 6단계: 환경 변수 업데이트

배포 후 실제 도메인을 알았으면:
1. Vercel 대시보드 → Settings → Environment Variables
2. `NEXT_PUBLIC_BASE_URL` 값을 실제 배포 URL로 업데이트
3. "Redeploy" 실행

## 다음 단계

배포가 완료되면 `DEPLOYMENT.md` 파일의 "검색 엔진 제출" 섹션을 따라 Google, Naver, Daum, Bing에 사이트를 등록하세요.
