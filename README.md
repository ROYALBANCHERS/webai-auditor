# 🌐 WebAI Auditor - Comprehensive Tech Stack Analysis

A powerful website auditor that works with **ANY** tech stack - React, Vue, Angular, Next.js, WordPress, Shopify, AI-generated sites (v0, Claude, Cursor), and more.

**No AI dependency required** - pure technical analysis using Playwright browser automation.

## ✨ Features

- 🔍 **SEO Analysis** - Meta tags, headings, Open Graph, structured data
- 🔐 **Security Check** - HTTPS, mixed content, API keys exposure
- ⚡ **Performance** - Load times, DOM complexity, image optimization
- ♿ **Accessibility** - Alt text, ARIA labels, keyboard navigation
- 📱 **Mobile Ready** - Viewport, touch targets, responsive design
- 👥 **UX Review** - Navigation, CTAs, forms, user flow
- 🎨 **UI Design** - Typography, spacing, visual hierarchy
- ⚙️ **Functionality** - Working forms, links, videos
- 🧱 **Tech Stack Detection** - All frameworks, libraries, CMS, analytics

## 🏗️ Architecture

### Frontend (Vite + React)
- URL input + loading + results view
- Calls backend API for comprehensive audits

### Backend (Express + Playwright)
- Opens websites in real Chromium browser
- Collects 100+ technical signals
- No AI/LLM dependency - pure analysis

## 🚀 Quick Start

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment** (optional)
Create `.env` file:
```bash
VITE_BACKEND_URL=http://localhost:8787
```

3. **Run full stack**
```bash
npm run dev:full
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

### Run separately

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## 📦 Deployment

### Frontend on GitHub Pages

Already configured! Just push to `main` branch.

### Backend on Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `ROYALBANCHERS/webai-auditor`
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `8787`
6. Deploy!

**Or use Blueprint:**
```
https://render.com/blueprint?url=https://github.com/ROYALBANCHERS/webai-auditor/blob/main/render.yaml
```

After deployment, update frontend `VITE_BACKEND_URL`:
```bash
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## 📡 API Endpoints

### `GET /api/health`
Health check endpoint.

### `POST /api/audit`
Main audit endpoint.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "rating": 4.2,
  "techStack": {
    "frameworks": ["React", "Next.js"],
    "libraries": ["Tailwind CSS"],
    "analytics": ["Google Analytics"],
    "cms": [],
    "ecommerce": []
  },
  "issues": [
    {
      "title": "Missing Meta Description",
      "description": "...",
      "severity": "high",
      "category": "SEO"
    }
  ],
  "seoAnalysis": { "issues": [], "goodPoints": [] },
  "securityAnalysis": { "issues": [], "goodPoints": [] },
  "performanceAnalysis": { "issues": [], "goodPoints": [] },
  "accessibilityAnalysis": { "issues": [], "goodPoints": [] },
  "mobileAnalysis": { "issues": [], "goodPoints": [] },
  "uxAnalysis": { "issues": [], "goodPoints": [] },
  "uiAnalysis": { "issues": [], "goodPoints": [] },
  "functionalityAnalysis": { "issues": [], "goodPoints": [] },
  "screenshots": {
    "desktop": "base64...",
    "mobile": "base64..."
  },
  "advice": "..."
}
```

### `POST /api/feedback`
Submit feedback on audit results.

### `GET /api/audits`
Get audit history.

### `GET /api/stats`
Get analytics and statistics.

## 🛠️ Tech Stack Detection

Detects:
- **Frameworks**: React, Vue, Angular, Svelte, SolidJS, Next.js, Nuxt, Remix, Gatsby, Astro, SvelteKit
- **Libraries**: Bootstrap, Tailwind, jQuery, MUI, Chakra, Ant Design, styled-components
- **Build Tools**: Vite, Webpack, Parcel, esbuild, Rollup
- **Hosting**: Vercel, Netlify, Cloudflare, Firebase, AWS
- **CMS**: WordPress, Shopify, Squarespace, Wix, Webflow
- **Analytics**: GA4, GTM, Facebook Pixel, Mixpanel, Amplitude, Hotjar

## 📝 License

MIT
