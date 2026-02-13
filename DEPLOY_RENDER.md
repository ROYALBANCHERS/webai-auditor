# 🚀 Deploy Backend to Render - Quick Guide

## About Auditor

The WebAI Auditor now works like a **real human being**:
- ✅ Visits EACH page individually
- ✅ Runs 8 comprehensive analyses per page (SEO, Security, Performance, Accessibility, Mobile, UX, UI, Functionality)
- ✅ Rates each page individually (0-5 stars)
- ✅ Overall rating = average of all tested pages
- ✅ Issues labeled with page path (e.g., "[About Page] Missing H1")

---

## Method 1: Render Blueprint (Easiest - One Click)

1. Copy this URL and open in browser:
   ```
   https://render.com/blueprint?url=https://github.com/ROYALBANCHERS/webai-auditor/blob/main/render.yaml
   ```

2. Click "Apply" - Render will create the service with all settings pre-configured!

---

## Method 2: Manual Deploy (Full Control)

### Step 1: Go to Render
Visit: https://render.com

### Step 2: Create New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### Step 3: Connect GitHub
- Click **"Connect GitHub"**
- Authorize Render to access your repositories
- Search for: **ROYALBANCHERS/webai-auditor**
- Click **Connect**

### Step 4: Configure the Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | webai-auditor-backend |
| **Region** | Singapore (or closest to you) |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | npm install |
| **Start Command** | node backend/server.js |

### Step 5: Add Environment Variables

Click "Advanced" → "Add Environment Variable":

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 8787 |

### Step 6: Deploy!
Click **"Create Web Service"** button at the bottom.

---

## After Deployment

Render will build and deploy your backend. You'll see:

```
✅ Deployment successful!
```

Your backend URL will be:
```
https://webai-auditor-backend-xxxx.onrender.com
```

---

## Connect Frontend to Render Backend

### Option A: Update GitHub Pages Settings

1. Go to your GitHub repo → Settings → Pages
2. Add Environment Variable:
   - Name: `VITE_BACKEND_URL`
   - Value: `https://your-backend.onrender.com`
3. GitHub Pages will rebuild with new backend URL

### Option B: Test Locally First

Create `.env` file in project root:
```bash
VITE_BACKEND_URL=https://your-backend.onrender.com
```

Then run:
```bash
npm run dev:frontend
```

---

## Troubleshooting

**Service not starting?**
- Check logs in Render Dashboard → Logs tab
- Common issue: Playwright browsers not installed (first deployment takes longer)

**CORS errors?**
- Make sure `VITE_BACKEND_URL` is set correctly
- Backend already has CORS enabled for all origins

**Timeout errors?**
- Playwright audits take 30-60 seconds
- Increase timeout in Render if needed

---

## Auto-Deploy on Git Push

Once connected, Render automatically watches your `main` branch.
Every time you push to `main`, Render redeploys automatically! 🚀
