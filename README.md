# Network Failure Simulator - Product List App

## Assignment: Option D - Network Failure (simulated)

A single-page web application that displays a product list and simulates real-world network failures including **timeouts** and **503 Service Unavailable** errors.

## 🎯 What This App Does

- **Happy Path**: Fetches and displays a list of 10 products from a mock API endpoint
- **Failure Simulation**: Toggle between normal operation, timeout errors, and 503 errors
- **Error Handling**: Displays a crash banner when network failures occur
- **Structured Logging**: Outputs detailed JSON logs to the browser console

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Deployment**: Vercel-ready
- **API**: Mock server built with Next.js API routes

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

## 📦 Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Next.js)

## 🎮 How to Use & Trigger Failures

### Normal Operation (Happy Path)

1. Open the app
2. Ensure "Normal (Happy Path)" is selected
3. Click "Fetch Products"
4. You should see 10 products displayed in a grid
5. Check console for successful log entry

### Simulate Timeout

1. Select "⏱️ Simulate Timeout" radio button
2. Click "Fetch Products"
3. The request will take 10+ seconds
4. Client-side timeout (5s) will trigger first
5. You'll see error banner: **"Network failure: request timed out (client timeout: 5000ms)"**
6. Check console for timeout log

### Simulate 503 Service Unavailable

1. Select "❌ Simulate 503 Error" radio button
2. Click "Fetch Products"
3. After ~200ms, the server returns 503
4. You'll see error banner: **"Network failure: 503 Service Unavailable"**
5. Check console for 503 log

## 📊 Expected Console Logs

### Success Log (Happy Path)
```json
{
  "timestamp": "2025-11-21T10:30:45.123Z",
  "url": "/api/products",
  "method": "GET",
  "latencyMs": 152,
  "statusOrReason": 200,
  "errorCode": null,
  "message": "Successfully retrieved products"
}
```

### Timeout Log
```json
{
  "timestamp": "2025-11-21T10:31:15.456Z",
  "url": "/api/products",
  "method": "GET",
  "latencyMs": 10003,
  "statusOrReason": "TIMEOUT",
  "errorCode": "NET_TIMEOUT",
  "message": "Request timed out - server took too long to respond"
}
```

### 503 Error Log
```json
{
  "timestamp": "2025-11-21T10:32:00.789Z",
  "url": "/api/products",
  "method": "GET",
  "latencyMs": 203,
  "statusOrReason": 503,
  "errorCode": "NET_503",
  "message": "503 Service Unavailable - server temporarily unavailable"
}
```

## 🏗️ Project Structure

```
.
├── pages/
│   ├── api/
│   │   └── products.js        # Mock API endpoint with failure injection
│   ├── _app.js                # Next.js app wrapper
│   └── index.js               # Main product list page with UI
├── styles/
│   ├── globals.css            # Global styles
│   └── Home.module.css        # Component-specific styles
├── package.json               # Dependencies
├── next.config.js             # Next.js configuration
├── vercel.json                # Vercel deployment config
└── README.md                  # This file
```

## ✅ Assignment Requirements Checklist

- ✅ **Working happy path**: Products load successfully when no failure is toggled
- ✅ **Failure Toggle**: UI controls to deterministically inject timeout or 503 errors
- ✅ **Crash/Error Banner**: Red error banner displays human-readable messages
- ✅ **Structured Logs**: JSON logs printed to console with all required fields:
  - `timestamp`: ISO 8601 format
  - `url`: Request endpoint
  - `method`: HTTP method
  - `latencyMs`: Request duration in milliseconds
  - `statusOrReason`: HTTP status code or error reason
  - `errorCode`: Error classification (NET_TIMEOUT, NET_503, etc.)
  - `message`: Human-readable description
- ✅ **README**: Complete setup and usage instructions
- ✅ **Vercel-ready**: Can be deployed with zero configuration

## 🎯 Failure Type: Option D

**Network Failure (simulated)**

This app simulates two types of network failures:
1. **Timeout**: Server delays response beyond client timeout threshold (5 seconds)
2. **503 Service Unavailable**: Server returns HTTP 503 status code

Both failures are triggered via a UI toggle and produce detailed structured logs.

## 🔍 How It Works

1. **Mock API** (`/api/products`) returns 10 product objects
2. **Failure injection** is controlled via `failureMode` query parameter
3. **Client-side timeout** set to 5 seconds using AbortController
4. **Server-side delay** of 10 seconds simulates slow network/timeout
5. **Structured logger** captures all request metadata and errors
6. **Error banner** displays when failures occur

## 📝 Notes

- All logs are printed to the browser console (open DevTools → Console)
- The timeout simulation uses a 10-second server delay, which triggers a 5-second client timeout
- The 503 error has a realistic 200ms network latency simulation
- Products are stored in memory (no database required)

## 👨‍💻 Author

Network Failure Simulator - Assignment Submission

---

**Failure Type**: Option D - Network Failure (Timeout / 503 Service Unavailable)
