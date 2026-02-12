# Bhai Website Auditor

AI Website Auditor jo website ko real browser me run karke UX/UI + functionality audit karta hai, phir simple Hinglish me result deta hai.

## Why your GitHub Pages site was blank
GitHub Pages project URL (`https://<user>.github.io/webai-auditor/`) par Vite app blank isliye aa rahi thi kyunki production assets root path (`/assets/...`) se load ho rahe the. Ab Vite `base` properly `/webai-auditor/` set hai, to Pages par JS/CSS resolve ho jayega.

## Architecture

### Frontend (Vite + React)
- URL input + loading + results view
- Calls backend endpoint: `POST /api/audit`
- Deploy target: GitHub Pages / Vercel / Netlify

### Backend (Express + Playwright + Gemini)
- Opens website in Playwright Chromium
- Collects real page signals (buttons, links, meta, etc.)
- Generates Bhai-style audit response via Gemini
- If `GEMINI_API_KEY` missing: falls back to heuristic report

## Local development

### 1) Install
```bash
npm install
```

### 2) Environment
Create `.env` (or shell env):
```bash
GEMINI_API_KEY=your_key_here
VITE_BACKEND_URL=http://localhost:8787
```

### 3) Run full stack
```bash
npm run dev:full
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8787`

## Production deployment

### Frontend on GitHub Pages
1. Build frontend:
```bash
npm run build
```
2. Deploy `dist/` to GitHub Pages branch/workflow.

> `vite.config.ts` already sets `base: '/webai-auditor/'` for production.

### Backend on Render/Railway/Fly.io
Start command:
```bash
npm run start:backend
```
Set env:
- `PORT`
- `GEMINI_API_KEY`

Then point frontend to backend:
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
