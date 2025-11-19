# GitHub Pages Deployment Guide

## 📌 Overview

This guide explains how to deploy the **Product Store Network Failure Simulation** to GitHub Pages.

**Important:** GitHub Pages only hosts static files (HTML, CSS, JS). The original version uses a Node.js backend, so I've created a **client-side only version** that simulates all failures in the browser.

## 🎯 Two Versions Available

### 1. **Full-Stack Version** (Local Development)
- **Files:** `index.html`, `app.js`, `server.js`
- **Requires:** Node.js server running
- **Best for:** Testing with actual backend simulation

### 2. **GitHub Pages Version** (Static/Client-Side)
- **Files:** `index-github-pages.html`, `app-github-pages.js`, `styles.css`
- **Requires:** No backend - runs entirely in browser
- **Best for:** Online demo deployment

## 🚀 Deployment Steps

### Step 1: Enable GitHub Pages

1. **Go to your repository on GitHub:**
   ```
   https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App
   ```

2. **Navigate to Settings:**
   - Click the **Settings** tab in your repository

3. **Find Pages Section:**
   - Scroll down to **Pages** in the left sidebar
   - Or go directly to: `https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App/settings/pages`

4. **Configure Source:**
   - Under **Source**, select: `Deploy from a branch`
   - Under **Branch**, select: `main` (or `master`)
   - Select folder: `/ (root)`
   - Click **Save**

5. **Wait for Deployment:**
   - GitHub will automatically build and deploy
   - This usually takes 1-3 minutes
   - You'll see a message: "Your site is live at..."

### Step 2: Rename GitHub Pages Files

To make the client-side version the default on GitHub Pages, you need to rename the files:

**Option A: Using PowerShell (Recommended)**

```powershell
cd "c:\Users\HP\Desktop\SSD#4"

# Backup the original files
Copy-Item index.html index-local.html
Copy-Item app.js app-local.js

# Replace with GitHub Pages version
Copy-Item index-github-pages.html index.html -Force
Copy-Item app-github-pages.js app.js -Force

# Commit and push
git add .
git commit -m "Deploy GitHub Pages version"
git push origin main
```

**Option B: Manual Renaming**

1. Rename `index.html` → `index-local.html`
2. Rename `app.js` → `app-local.js`
3. Rename `index-github-pages.html` → `index.html`
4. Rename `app-github-pages.js` → `app.js`
5. Commit and push changes

### Step 3: Access Your Deployed App

Your app will be available at:
```
https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/
```

## 🔧 Alternative: Use a Subfolder Approach

If you want to keep both versions accessible:

### Structure:
```
repository/
├── index.html (local version - landing page)
├── demo/
│   ├── index.html (GitHub Pages version)
│   ├── app.js (client-side version)
│   └── styles.css
├── app.js (original with backend)
├── server.js
└── README.md
```

### Steps:
1. Create a `demo` folder
2. Copy `index-github-pages.html`, `app-github-pages.js`, and `styles.css` into it
3. Rename them to remove "-github-pages" suffix
4. Your demo will be at: `https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/demo/`

## 📝 Complete Deployment Script

Run this in PowerShell to deploy the client-side version:

```powershell
# Navigate to project directory
cd "c:\Users\HP\Desktop\SSD#4"

# Create backups
Copy-Item index.html index-backup.html
Copy-Item app.js app-backup.js

# Deploy GitHub Pages version
Copy-Item index-github-pages.html index.html -Force
Copy-Item app-github-pages.js app.js -Force

# Stage all changes
git add .

# Commit with deployment message
git commit -m "Deploy client-side version for GitHub Pages"

# Push to GitHub
git push origin main

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your app will be live at:" -ForegroundColor Cyan
Write-Host "https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/" -ForegroundColor Yellow
Write-Host "`nNote: It may take 1-3 minutes for changes to appear." -ForegroundColor Gray
```

## 🎨 What's Different in the GitHub Pages Version?

### Original (Backend) Version:
- Real HTTP requests to Express server
- Actual network timeout (5s server delay vs 3s client timeout)
- Real 503 HTTP responses
- Runs on `localhost:3000`

### GitHub Pages (Client-Side) Version:
- Mock data stored in JavaScript
- Simulated delays using `setTimeout`
- Simulated HTTP errors without actual requests
- Runs directly in browser
- **Same user experience and logging functionality**

## ✅ Verification Checklist

After deployment, verify:
- [ ] App loads at the GitHub Pages URL
- [ ] Products display correctly in normal mode
- [ ] Timeout failure triggers after ~3 seconds
- [ ] 503 error displays immediately
- [ ] Error banner shows correct messages
- [ ] Console logs display in JSON format
- [ ] All styling appears correctly

## 🐛 Troubleshooting

### Issue: 404 Page Not Found
**Solution:** 
- Ensure `index.html` exists in the root or selected folder
- Check that GitHub Pages is enabled in repository settings
- Wait a few minutes for deployment to complete

### Issue: Styles not loading
**Solution:**
- Ensure `styles.css` is in the same directory as `index.html`
- Check browser console for 404 errors
- Verify file paths are relative (not absolute)

### Issue: JavaScript not working
**Solution:**
- Open browser console (F12) to check for errors
- Ensure `app.js` is properly linked in `index.html`
- Clear browser cache and refresh

### Issue: Changes not appearing
**Solution:**
- Wait 1-3 minutes for GitHub Pages to rebuild
- Check the Actions tab for deployment status
- Hard refresh browser: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

## 🔄 Updating Your Deployment

Whenever you make changes:

```powershell
git add .
git commit -m "Update: description of changes"
git push origin main
```

GitHub Pages will automatically redeploy in 1-3 minutes.

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Actions for Pages](https://github.com/peaceiris/actions-gh-pages)

## 💡 Pro Tips

1. **Custom Domain:** You can use a custom domain instead of `username.github.io`
2. **HTTPS:** GitHub Pages automatically provides HTTPS
3. **Analytics:** Add Google Analytics to track visitors
4. **Performance:** GitHub Pages has CDN for fast global access
5. **Free:** Unlimited bandwidth for public repositories

## 🎯 Next Steps

After deployment, you can:
- Share the live link in your assignment submission
- Add the link to your resume/portfolio
- Test from different devices and browsers
- Monitor usage via GitHub traffic insights

---

**Live Demo:** Once deployed, your app will be at:
`https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/`
