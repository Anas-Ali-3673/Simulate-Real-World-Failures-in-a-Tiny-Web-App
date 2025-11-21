# Network Failure Simulator - Assignment Submission

## Student Information
**Assignment**: Simulate Real-World Failures in a Tiny Web App
**Option Selected**: Option D - Network Failure (simulated)

---

## What I Built

A single-page product list web application that simulates real-world network failures including timeouts and 503 Service Unavailable errors.

**Tech Stack**: Next.js, React, Vercel

---

## Live Demo

**Deployed URL**: [Your Vercel URL here after deployment]

**GitHub Repository**: https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App

---

## How to Run Locally

1. Clone the repository:
```
git clone https://github.com/Anas-Ali-3673/Simulate-Real-World-Failures-in-a-Tiny-Web-App.git
cd Simulate-Real-World-Failures-in-a-Tiny-Web-App
```

2. Install dependencies:
```
npm install
```

3. Start development server:
```
npm run dev
```

4. Open http://localhost:3000 in your browser

---

## How to Trigger Failures

### Happy Path (Normal Operation)
1. Select "Normal (Happy Path)" radio button
2. Click "Fetch Products" 
3. See 10 products displayed successfully
4. Check browser console for success log

### Simulate Timeout
1. Select "⏱️ Simulate Timeout" radio button
2. Click "Fetch Products"
3. Wait 5 seconds - client timeout triggers
4. See error banner: "Network failure: request timed out"
5. Check console for timeout log with errorCode: "NET_TIMEOUT"

### Simulate 503 Error
1. Select "❌ Simulate 503 Error" radio button
2. Click "Fetch Products"
3. Server returns 503 after 200ms
4. See error banner: "Network failure: 503 Service Unavailable"
5. Check console for 503 log with errorCode: "NET_503"

---

## Sample Console Logs

### Success Log
```json
{
  "timestamp": "2025-11-22T10:30:45.123Z",
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
  "timestamp": "2025-11-22T10:31:15.456Z",
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
  "timestamp": "2025-11-22T10:32:00.789Z",
  "url": "/api/products",
  "method": "GET",
  "latencyMs": 203,
  "statusOrReason": 503,
  "errorCode": "NET_503",
  "message": "503 Service Unavailable - server temporarily unavailable"
}
```

---

## Assignment Requirements Checklist

✅ Working "happy path" - Products load successfully in normal mode
✅ Failure Toggle - Radio buttons to switch between normal/timeout/503
✅ Crash/Error Banner - Red banner displays error messages
✅ Structured Logging - JSON logs with all required fields:
   - timestamp (ISO 8601 format)
   - url (request endpoint)
   - method (HTTP method)
   - latencyMs (request duration)
   - statusOrReason (status code or error reason)
   - errorCode (NET_TIMEOUT, NET_503, etc.)
   - message (human-readable description)
✅ README - Complete documentation included
✅ Vercel Deployment - App is production-ready

---

## Failure Type Details

**Option D - Network Failure**

Two types of network failures are simulated:

1. **Timeout**: Server delays response for 10 seconds, triggering client-side 5-second timeout
2. **503 Service Unavailable**: Server returns HTTP 503 status code with realistic 200ms latency

Both failures are deterministically triggered via UI toggle controls and produce detailed structured JSON logs visible in the browser console.

---

## Technical Implementation

- **Mock API**: `/api/products` endpoint returns 10 product objects
- **Failure Injection**: Controlled via `failureMode` query parameter
- **Client Timeout**: 5 seconds using AbortController
- **Server Delay**: 10 seconds for timeout simulation
- **Structured Logger**: Captures all request metadata and errors
- **Error Display**: Red banner component for user feedback

---

## Screenshots

(Open the app to see the UI - includes product grid, failure toggle controls, error banner, and console logs)
