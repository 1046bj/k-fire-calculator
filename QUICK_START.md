# 빠른 배포 가이드

## ✅ 완료된 작업
- ✅ Git 저장소 초기화
- ✅ 모든 파일 커밋 완료
- ✅ 브랜치를 `main`으로 설정

## 다음 단계 (5분 소요)

### 1. GitHub 저장소 생성

1. [GitHub](https://github.com) 접속 및 로그인
2. 우측 상단 **"+"** 버튼 → **"New repository"** 클릭
3. 저장소 정보 입력:
   - **Repository name**: `korean-fire-simulator` (또는 원하는 이름)
   - **Visibility**: Public 또는 Private 선택
   - **README, .gitignore, license 추가하지 않기** (이미 있음)
4. **"Create repository"** 클릭

### 2. GitHub에 푸시

프로젝트 디렉토리에서 다음 명령어 실행:

```powershell
cd "d:\Program Files\Fire Simulator with stocks"

# 원격 저장소 추가 (YOUR_USERNAME을 본인의 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/korean-fire-simulator.git

# GitHub에 푸시
git push -u origin main
```

### 3. Vercel 배포

1. [Vercel](https://vercel.com) 접속 및 로그인 (GitHub 계정으로 로그인 권장)
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"**에서 방금 생성한 GitHub 저장소 선택
4. 프로젝트 설정 (자동 감지됨):
   - Framework Preset: **Next.js** ✅
   - Root Directory: `./` ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
5. **"Deploy"** 클릭

### 4. 배포 완료 확인

배포가 완료되면 (약 2-3분):
- Vercel 대시보드에서 배포된 URL 확인 (예: `https://korean-fire-simulator.vercel.app`)
- 브라우저에서 사이트 접속 테스트
- 다음 URL들이 정상 작동하는지 확인:
  - `https://your-app.vercel.app/sitemap.xml`
  - `https://your-app.vercel.app/robots.txt`

### 5. 환경 변수 설정 (선택사항)

Vercel 대시보드 → **Settings** → **Environment Variables**에서:

1. `NEXT_PUBLIC_BASE_URL`: 배포된 URL (예: `https://your-app.vercel.app`)
2. `NEXT_PUBLIC_GOOGLE_VERIFICATION`: (나중에 Google Search Console에서 받은 코드)
3. `NEXT_PUBLIC_NAVER_VERIFICATION`: (나중에 Naver Search Advisor에서 받은 코드)

환경 변수 추가 후 **"Redeploy"** 실행

### 6. 검색 엔진 제출

배포가 완료되면 `DEPLOYMENT.md` 파일의 "검색 엔진 제출" 섹션을 따라:
- Google Search Console
- Naver Search Advisor  
- Daum 검색 등록
- Bing Webmaster Tools

에 사이트를 등록하세요.

## 문제 해결

### GitHub 푸시 실패 시
- GitHub 인증 확인 (Personal Access Token 필요할 수 있음)
- 저장소 URL이 정확한지 확인

### Vercel 배포 실패 시
- Vercel 대시보드의 로그 확인
- 로컬에서 `npm run build` 실행하여 빌드 오류 확인

## 도움말

자세한 내용은 다음 파일을 참고하세요:
- `DEPLOYMENT.md`: 상세 배포 가이드
- `GIT_SETUP.md`: Git 설정 가이드
