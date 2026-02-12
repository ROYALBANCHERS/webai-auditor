# Bhai Website Auditor

AI Website Auditor jo website ko real browser me run karke UX/UI + functionality audit karta hai, phir simple Hinglish me result deta hai.

## Blank page issue (root cause + fix)
Aapke GitHub Pages URL par blank page ka main reason usually ye hota hai:
1. Vite project build serve nahi ho raha (source files serve ho rahe hote hain, jaise `/index.tsx`).
2. Project repo path ke hisaab se `base` path configure nahi hota.

Is repo me dono fix add kar diye gaye:
- Vite production base path configured (`/webai-auditor/`).
- GitHub Actions workflow added jo `dist/` build ko direct Pages par deploy karta hai.
- SPA fallback `404.html` bhi generate hota hai, taaki refresh pe blank/404 issue na aaye.

## Architecture

### Frontend (Vite + React)
- URL input + loading + results view
- Calls backend endpoint: `POST /api/audit`

### Backend (Express + Playwright + Gemini)
- Opens website in Playwright Chromium
- Collects real page signals (buttons, links, meta, etc.)
- Generates Bhai-style audit response via Gemini
- If Playwright/Gemini unavailable: heuristic fallback

## Local development

### 1) Install
```bash
npm install
```

### 2) Environment
Create `.env`:
```bash
GEMINI_API_KEY=your_key_here
VITE_BACKEND_URL=http://localhost:8787
# optional if repo name changes
VITE_BASE_PATH=/webai-auditor/
```

### 3) Run full stack
```bash
npm run dev:full
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8787`

## Production deployment

### Frontend on GitHub Pages
Workflow file: `.github/workflows/deploy-pages.yml`

- Push to `main` branch and workflow auto deploy karega.
- GitHub repo settings me ensure karo:
  - **Pages → Build and deployment → Source: GitHub Actions**

Manual local Pages build check:
```bash
npm run build:pages
```

### Backend on Render/Railway/Fly.io
Start command:
```bash
npm run start:backend
```
Required env:
- `PORT`
- `GEMINI_API_KEY`

Then frontend ko backend URL do:
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

## API

### `GET /api/health`
Health check.

### `POST /api/audit`
Body:
```json
{ "url": "https://example.com" }
```
Returns:
```json
{
  "summary": "Bhai ...",
  "issues": ["..."],
  "technical_analysis": ["..."],
  "rating": 3.75,
  "advice": "..."
}
```
