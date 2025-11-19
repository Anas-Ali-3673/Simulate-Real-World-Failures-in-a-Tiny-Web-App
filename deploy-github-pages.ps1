# GitHub Pages Deployment Script
# Run this script to deploy the client-side version to GitHub Pages

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  GitHub Pages Deployment Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Navigate to project directory
$projectPath = "c:\Users\HP\Desktop\SSD#4"
Set-Location $projectPath

Write-Host "[1/5] Creating backups..." -ForegroundColor Yellow
# Create backups of original files
if (Test-Path "index.html") {
    Copy-Item "index.html" "index-local.html" -Force
    Write-Host "  ✓ Backed up index.html -> index-local.html" -ForegroundColor Green
}

if (Test-Path "app.js") {
    Copy-Item "app.js" "app-local.js" -Force
    Write-Host "  ✓ Backed up app.js -> app-local.js" -ForegroundColor Green
}

Write-Host "`n[2/5] Deploying GitHub Pages version..." -ForegroundColor Yellow
# Replace with GitHub Pages version
Copy-Item "index-github-pages.html" "index.html" -Force
Write-Host "  ✓ Copied index-github-pages.html -> index.html" -ForegroundColor Green

Copy-Item "app-github-pages.js" "app.js" -Force
Write-Host "  ✓ Copied app-github-pages.js -> app.js" -ForegroundColor Green

Write-Host "`n[3/5] Staging changes..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files staged" -ForegroundColor Green

Write-Host "`n[4/5] Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy client-side version for GitHub Pages"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "  ℹ No changes to commit" -ForegroundColor Gray
}

Write-Host "`n[5/5] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Successfully pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "  ✗ Push failed. Check your git configuration." -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Your app will be live at:" -ForegroundColor White
Write-Host "https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/" -ForegroundColor Yellow

Write-Host "`n📌 Notes:" -ForegroundColor Cyan
Write-Host "  • It may take 1-3 minutes for changes to appear" -ForegroundColor Gray
Write-Host "  • Original files backed up as index-local.html and app-local.js" -ForegroundColor Gray
Write-Host "  • To run locally with backend: use index-local.html and npm start" -ForegroundColor Gray

Write-Host "`n🔍 Check deployment status at:" -ForegroundColor Cyan
Write-Host "https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App/actions`n" -ForegroundColor Yellow
