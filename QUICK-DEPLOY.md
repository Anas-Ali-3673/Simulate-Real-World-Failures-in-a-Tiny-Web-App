# 🚀 Quick Deployment Guide

## Two Simple Options to Deploy to GitHub Pages

### ✨ Option 1: Automated Script (Recommended)

Run this single command in PowerShell:

```powershell
cd "c:\Users\HP\Desktop\SSD#4"
.\deploy-github-pages.ps1
```

**That's it!** The script will:
- Backup your original files
- Deploy the GitHub Pages version
- Commit and push to GitHub
- Show you the live URL

---

### 🛠️ Option 2: Manual Steps

```powershell
cd "c:\Users\HP\Desktop\SSD#4"

# Backup originals
Copy-Item index.html index-local.html
Copy-Item app.js app-local.js

# Deploy GitHub Pages version
Copy-Item index-github-pages.html index.html -Force
Copy-Item app-github-pages.js app.js -Force

# Push to GitHub
git add .
git commit -m "Deploy GitHub Pages version"
git push origin main
```

---

## 📍 Enable GitHub Pages (One-Time Setup)

1. Go to: https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App/settings/pages
2. Under **Source**, select: `Deploy from a branch`
3. Under **Branch**, select: `main` and `/ (root)`
4. Click **Save**

---

## 🌐 Your Live App URL

After deployment (wait 1-3 minutes):

**https://anas-ali-3673.github.io/Simulate-Real-World-Failures-in-a-Tiny-Web-App/**

---

## 📋 What's Different?

| Feature | Local Version | GitHub Pages Version |
|---------|---------------|---------------------|
| **Backend** | Node.js/Express | Client-side only |
| **Data** | Real API calls | Mock data in JS |
| **Timeout** | Real network delay | Simulated with setTimeout |
| **503 Error** | Real HTTP response | Simulated error object |
| **Functionality** | ✅ Full | ✅ Full (same UX) |
| **Deployment** | Requires server | Static files only |

Both versions have the **exact same user experience** and logging!

---

## ✅ Verify Deployment

1. Visit your GitHub Pages URL
2. Test normal mode (toggle OFF)
3. Test timeout failure (toggle ON, select "Timeout")
4. Test 503 failure (toggle ON, select "503")
5. Check console logs appear

---

## 🔄 Future Updates

Whenever you make changes:

```powershell
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Pages auto-updates in 1-3 minutes.

---

## 📚 Need More Details?

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for:
- Troubleshooting
- Custom domains
- Advanced configurations
- Alternative deployment methods

---

## 💡 Quick Tips

✅ Both versions work identically for your assignment  
✅ GitHub Pages version = no server needed  
✅ Perfect for online demos and portfolios  
✅ Free hosting with HTTPS  
✅ Fast global CDN  

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) or open an issue on GitHub.
