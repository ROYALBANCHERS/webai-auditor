import cors from 'cors';
import express from 'express';
import { auditWebsiteWithBrowser } from './websiteAuditor.js';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'webai-auditor-backend' });
});

app.post('/api/audit', async (req, res) => {
  const url = String(req.body?.url || '').trim();

  if (!url) {
    return res.status(400).send('URL is required.');
  }

  try {
    const report = await auditWebsiteWithBrowser(url);
    return res.json(report);
  } catch (error) {
    console.error('Audit API Error:', error);
    return res.status(500).send('Bhai audit karte time issue aa gaya. Thoda der baad try kar.');
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
