# Vercel 배포 자동화 스크립트
# 이 스크립트는 GitHub 저장소 생성 후 실행하세요

Write-Host "=== 한국형 FIRE 계산기 배포 스크립트 ===" -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리 확인
$projectPath = "d:\Program Files\Fire Simulator with stocks"
Set-Location $projectPath

# Git 상태 확인
Write-Host "1. Git 상태 확인 중..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "   변경사항이 있습니다. 커밋하시겠습니까? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "Y" -or $response -eq "y") {
        git add .
        git commit -m "Update: Prepare for deployment"
        Write-Host "   ✓ 커밋 완료" -ForegroundColor Green
    }
} else {
    Write-Host "   ✓ 모든 변경사항이 커밋되었습니다" -ForegroundColor Green
}

# 원격 저장소 확인
Write-Host ""
Write-Host "2. 원격 저장소 확인 중..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "   ✓ 원격 저장소: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "   ⚠ 원격 저장소가 설정되지 않았습니다" -ForegroundColor Red
    Write-Host ""
    Write-Host "   GitHub 저장소를 먼저 생성하세요:" -ForegroundColor Yellow
    Write-Host "   1. https://github.com 접속" -ForegroundColor White
    Write-Host "   2. 'New repository' 클릭" -ForegroundColor White
    Write-Host "   3. 저장소 이름 입력 (예: korean-fire-simulator)" -ForegroundColor White
    Write-Host "   4. 생성 후 다음 명령어 실행:" -ForegroundColor White
    Write-Host "      git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    Write-Host "      git branch -M main" -ForegroundColor Cyan
    Write-Host "      git push -u origin main" -ForegroundColor Cyan
    exit
}

# GitHub에 푸시
Write-Host ""
Write-Host "3. GitHub에 푸시 중..." -ForegroundColor Yellow
try {
    git push origin main 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ 푸시 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ 푸시 실패. 브랜치 이름을 확인하세요" -ForegroundColor Yellow
        $branch = git branch --show-current
        Write-Host "   현재 브랜치: $branch" -ForegroundColor White
        if ($branch -ne "main") {
            Write-Host "   브랜치를 main으로 변경합니다..." -ForegroundColor Yellow
            git branch -M main
            git push -u origin main
        }
    }
} catch {
    Write-Host "   ⚠ 푸시 중 오류 발생" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 다음 단계 ===" -ForegroundColor Cyan
Write-Host "1. Vercel에 배포:" -ForegroundColor Yellow
Write-Host "   - https://vercel.com 접속" -ForegroundColor White
Write-Host "   - 'Add New...' → 'Project' 클릭" -ForegroundColor White
Write-Host "   - GitHub 저장소 선택" -ForegroundColor White
Write-Host "   - 'Deploy' 클릭" -ForegroundColor White
Write-Host ""
Write-Host "2. 환경 변수 설정 (배포 후):" -ForegroundColor Yellow
Write-Host "   - NEXT_PUBLIC_BASE_URL: 배포된 URL" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_GOOGLE_VERIFICATION: Google Search Console 인증 코드" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_NAVER_VERIFICATION: Naver Search Advisor 인증 코드" -ForegroundColor White
Write-Host ""
Write-Host "자세한 내용은 DEPLOYMENT.md 파일을 참고하세요." -ForegroundColor Cyan
