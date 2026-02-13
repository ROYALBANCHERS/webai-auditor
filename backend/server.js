import cors from 'cors';
import express from 'express';
import { auditWebsiteWithBrowser } from './realUserAuditor.js';

const app = express();
const port = process.env.PORT || 8787;

// In-memory storage for user feedback (in production, use a database)
const userFeedback = [];
const auditHistory = [];

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'webai-auditor-backend', version: '2.0' });
});

// Main audit endpoint
app.post('/api/audit', async (req, res) => {
  const url = String(req.body?.url || '').trim();
  const language = req.body?.language || 'en'; // Default to English if not specified

  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 NEW AUDIT REQUEST: ${url}`);
    console.log(`🌐 Language: ${language === 'hi' ? 'हिंदी' : 'English'}`);
    console.log(`${'='.repeat(60)}`);

    const report = await auditWebsiteWithBrowser(url, { username: req.body?.username, password: req.body?.password }, language);

    // Store in history (in-memory for now)
    auditHistory.unshift({
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 audits
    if (auditHistory.length > 100) {
      auditHistory.pop();
    }

    console.log(`✅ Audit complete for: ${url} | Rating: ${report.rating}/5`);
    console.log(`${'='.repeat(60)}\n`);

    return res.json(report);
  } catch (error) {
    console.error('❌ Audit API Error:', error);
    return res.status(500).json({
      error: 'Audit failed while scanning the website. Please try again shortly.',
      message: error.message
    });
  }
});

// Submit feedback on an audit
app.post('/api/feedback', (req, res) => {
  const { auditId, url, rating, feedback, category } = req.body;

  if (!auditId || !feedback) {
    return res.status(400).json({ error: 'auditId and feedback are required.' });
  }

  const feedbackEntry = {
    id: Date.now().toString(),
    auditId,
    url,
    rating: Number(rating) || null,
    feedback: String(feedback),
    category: category || 'general',
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  userFeedback.unshift(feedbackEntry);

  // Keep only last 500 feedbacks
  if (userFeedback.length > 500) {
    userFeedback.pop();
  }

  console.log(`📝 New feedback received for ${url || auditId}`);

  return res.json({
    success: true,
    message: 'Feedback received! Thank you for helping improve the auditor.'
  });
});

// Get feedback for an audit
app.get('/api/feedback/:auditId', (req, res) => {
  const { auditId } = req.params;
  const feedbacks = userFeedback.filter(f => f.auditId === auditId);

  res.json({
    auditId,
    feedbacks: feedbacks.slice(0, 50), // Return max 50 feedbacks
    total: feedbacks.length
  });
});

// Get audit history (for admin/analytics)
app.get('/api/audits', (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const skip = Number(req.query.skip) || 0;

  res.json({
    audits: auditHistory.slice(skip, skip + limit),
    total: auditHistory.length,
    hasMore: skip + limit < auditHistory.length
  });
});

// Get specific audit by ID
app.get('/api/audits/:id', (req, res) => {
  const { id } = req.params;
  const audit = auditHistory.find(a => a.id === id);

  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }

  res.json(audit);
});

// Get all feedback (for admin)
app.get('/api/feedback/all', (req, res) => {
  const limit = Number(req.query.limit) || 100;

  res.json({
    feedbacks: userFeedback.slice(0, limit),
    total: userFeedback.length
  });
});

// Submit login test for audit (auth flow)
app.post('/api/test-login', async (req, res) => {
  const { url, username, password } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  // This would be implemented with Playwright
  // For now, return a placeholder response
  res.json({
    success: false,
    message: 'Login testing feature coming soon! This will test actual login functionality.',
    note: 'We will use the provided credentials to test if login works on the target site.'
  });
});

// Stats endpoint
app.get('/api/stats', (_req, res) => {
  const totalAudits = auditHistory.length;
  const totalFeedback = userFeedback.length;
  const avgRating = auditHistory.reduce((sum, a) => sum + (a.rating || 0), 0) / Math.max(1, totalAudits);

  const ratingDistribution = {
    excellent: auditHistory.filter(a => a.rating >= 4.5).length,
    good: auditHistory.filter(a => a.rating >= 3.5 && a.rating < 4.5).length,
    average: auditHistory.filter(a => a.rating >= 2.5 && a.rating < 3.5).length,
    poor: auditHistory.filter(a => a.rating < 2.5).length
  };

  const commonIssues = {};
  auditHistory.forEach(audit => {
    (audit.issues || []).forEach(issue => {
      const title = issue.title;
      commonIssues[title] = (commonIssues[title] || 0) + 1;
    });
  });

  const topIssues = Object.entries(commonIssues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, count]) => ({ title, count }));

  res.json({
    totalAudits,
    totalFeedback,
    averageRating: Number(avgRating.toFixed(2)),
    ratingDistribution,
    topIssues
  });
});

app.listen(port, () => {
  console.log(`\n🚀 WEBAI AUDITOR SERVER v2.0`);
  console.log(`📡 Listening on http://localhost:${port}`);
  console.log(`🔧 Features:`);
  console.log(`   - Real-user style browser automation`);
  console.log(`   - Tech stack detection`);
  console.log(`   - Page-by-page exploration`);
  console.log(`   - Interactive element testing`);
  console.log(`   - Auth/Signup flow testing`);
  console.log(`   - User feedback system`);
  console.log(`   - Login credential testing`);
  console.log(`${'='.repeat(60)}\n`);
});
