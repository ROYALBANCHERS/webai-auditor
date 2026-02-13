import { chromium } from 'playwright';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = (input) => {
  const raw = String(input || '').trim();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  return `https://${raw}`;
};

const severityOrder = { critical: 1.0, high: 0.7, medium: 0.4, low: 0.2 };

const createAnalysis = () => ({ issues: [], goodPoints: [], warnings: [] });

const discoverPages = async (page, baseUrl, maxPages = 20) => {
  const links = await page.evaluate((origin) => {
    const result = new Set(['/']);
    document.querySelectorAll('a[href]').forEach((anchor) => {
      try {
        const href = anchor.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        const abs = new URL(href, origin);
        if (abs.origin !== new URL(origin).origin) return;
        result.add(abs.pathname || '/');
      } catch {
        // ignore
      }
    });
    return Array.from(result);
  }, baseUrl);

  return links.slice(0, maxPages);
};

const analyzeSinglePage = async (context, pageUrl, path) => {
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  const consoleErrors = [];
  const runtimeErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => runtimeErrors.push(err.message));

  const start = Date.now();
  const response = await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(800);

  const dom = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="button"], input[type="submit"]'));
    const buttonDetails = allButtons.slice(0, 20).map((btn) => {
      const text = (btn.textContent || btn.getAttribute('value') || '').trim() || '(no label)';
      const disabled = !!btn.getAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
      const style = window.getComputedStyle(btn);
      const hidden = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
      return { text, disabled, hidden };
    });

    const links = Array.from(document.querySelectorAll('a[href]')).slice(0, 30).map((a) => ({
      href: a.getAttribute('href') || '',
      text: (a.textContent || '').trim() || '(no text)'
    }));

    const missingAlt = Array.from(document.querySelectorAll('img')).filter((img) => !img.getAttribute('alt')).length;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const hasViewport = !!document.querySelector('meta[name="viewport"]');

    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      hasViewport,
      metaDescription,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      buttonDetails,
      forms: document.querySelectorAll('form').length,
      inputs: document.querySelectorAll('input, textarea, select').length,
      links,
      missingAlt,
      navLinks: document.querySelectorAll('nav a[href]').length,
    };
  });

  let brokenLinks = 0;
  for (const link of dom.links.slice(0, 10)) {
    try {
      const abs = new URL(link.href, pageUrl).toString();
      const res = await page.request.get(abs, { timeout: 8000 });
      if (res.status() >= 400) brokenLinks += 1;
    } catch {
      brokenLinks += 1;
    }
  }

  const buttonBroken = dom.buttonDetails.filter((b) => b.disabled || b.hidden).length;
  const status = response?.status() || 0;
  const loadTime = Date.now() - start;

  await page.close();

  return {
    path,
    url: pageUrl,
    loaded: status > 0,
    status,
    loadTime,
    title: dom.title,
    buttonSummary: {
      total: dom.buttonDetails.length,
      working: Math.max(0, dom.buttonDetails.length - buttonBroken),
      broken: buttonBroken,
      details: dom.buttonDetails,
    },
    linkSummary: {
      checked: Math.min(10, dom.links.length),
      broken: brokenLinks,
    },
    seo: {
      hasMetaDescription: !!dom.metaDescription,
      hasCanonical: !!dom.canonical,
      h1Count: dom.h1Count,
    },
    accessibility: {
      missingAlt: dom.missingAlt,
    },
    consoleErrors,
    runtimeErrors,
    forms: dom.forms,
    hasViewport: dom.hasViewport,
    navLinks: dom.navLinks,
  };
};

const aggregateAnalysis = (auditData) => {
  const seo = createAnalysis();
  const security = createAnalysis();
  const performance = createAnalysis();
  const accessibility = createAnalysis();
  const mobile = createAnalysis();
  const ux = createAnalysis();
  const ui = createAnalysis();
  const functionality = createAnalysis();

  for (const p of auditData.pageAudits) {
    if (!p.loaded) {
      functionality.issues.push({ title: `Page failed to load: ${p.path}`, description: 'Page did not return a valid response.', severity: 'high', category: 'Functionality' });
      continue;
    }
    if (!p.seo.hasMetaDescription) seo.issues.push({ title: `Missing meta description (${p.path})`, description: 'Add a meta description for better snippets.', severity: 'medium', category: 'SEO' });
    else seo.goodPoints.push(`Meta description found on ${p.path}`);

    if (p.seo.h1Count !== 1) seo.issues.push({ title: `H1 structure issue (${p.path})`, description: `Expected 1 H1 but found ${p.seo.h1Count}.`, severity: 'medium', category: 'SEO' });

    if (p.buttonSummary.broken > 0) functionality.issues.push({ title: `Potential broken/disabled buttons (${p.path})`, description: `${p.buttonSummary.broken} button(s) appear disabled/hidden.`, severity: 'high', category: 'Functionality' });
    if (p.linkSummary.broken > 0) functionality.issues.push({ title: `Broken links detected (${p.path})`, description: `${p.linkSummary.broken} checked links returned errors.`, severity: 'high', category: 'Functionality' });

    if (p.consoleErrors.length || p.runtimeErrors.length) {
      functionality.issues.push({ title: `Console/runtime errors (${p.path})`, description: `${p.consoleErrors.length + p.runtimeErrors.length} errors seen in browser console/runtime.`, severity: 'high', category: 'Functionality' });
    }

    if (p.loadTime > 4000) performance.issues.push({ title: `Slow load time (${p.path})`, description: `Page loaded in ${p.loadTime}ms.`, severity: 'medium', category: 'Performance' });
    else performance.goodPoints.push(`Fast load time on ${p.path}`);

    if (p.accessibility.missingAlt > 0) accessibility.issues.push({ title: `Missing image alt text (${p.path})`, description: `${p.accessibility.missingAlt} images are missing alt text.`, severity: 'medium', category: 'Accessibility' });
    else accessibility.goodPoints.push(`Images include alt text on ${p.path}`);

    if (!p.hasViewport) mobile.issues.push({ title: `Missing viewport meta (${p.path})`, description: 'Add meta viewport for mobile rendering.', severity: 'high', category: 'Mobile' });

    if (p.navLinks < 2) ux.warnings.push({ title: `Weak navigation (${p.path})`, description: 'Very few navigation links were found.', category: 'UX' });
    if (!p.title) ui.issues.push({ title: `Missing page title (${p.path})`, description: 'No visible page title was found.', severity: 'low', category: 'UI' });
  }

  if (auditData.url.startsWith('https://')) security.goodPoints.push('HTTPS is enabled.');
  else security.issues.push({ title: 'Site is not using HTTPS', description: 'Use HTTPS to protect users.', severity: 'critical', category: 'Security' });

  return { seo, security, performance, accessibility, mobile, ux, ui, functionality };
};

const calculateRating = (issues) => {
  let rating = 5;
  issues.forEach((i) => {
    rating -= severityOrder[i.severity] || 0.2;
  });
  return Number(Math.max(1, Math.min(5, rating)).toFixed(1));
};

export const auditWebsiteWithBrowser = async (inputUrl, credentials = null) => {
  const url = normalizeUrl(inputUrl);
  const start = Date.now();
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  const auditData = {
    url,
    startTime: new Date(start).toISOString(),
    techStack: { frameworks: [], libraries: [], analytics: [], cms: [], ecommerce: [], fonts: [] },
    pages: [],
    pageAudits: [],
    interactiveTests: {},
    authTests: { hasLogin: false, hasSignup: false, loginPageAccessible: false, signupPageAccessible: false, socialLoginAvailable: false, issues: [], details: [] },
    issues: [],
    warnings: [],
    goodPoints: [],
    rating: 0,
    advice: '',
    certificate: null,
    totalTime: 0,
    auditDate: new Date().toISOString(),
  };

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const home = await context.newPage();
    await home.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    auditData.pages = await discoverPages(home, url, 20);
    const pagesToTest = auditData.pages.slice(0, 10);

    for (const path of pagesToTest) {
      const pageUrl = new URL(path, url).toString();
      const result = await analyzeSinglePage(context, pageUrl, path);
      auditData.pageAudits.push(result);
    }

    const analysis = aggregateAnalysis(auditData);
    auditData.seoAnalysis = analysis.seo;
    auditData.securityAnalysis = analysis.security;
    auditData.performanceAnalysis = analysis.performance;
    auditData.accessibilityAnalysis = analysis.accessibility;
    auditData.mobileAnalysis = analysis.mobile;
    auditData.uxAnalysis = analysis.ux;
    auditData.uiAnalysis = analysis.ui;
    auditData.functionalityAnalysis = analysis.functionality;

    auditData.issues = [
      ...analysis.seo.issues,
      ...analysis.security.issues,
      ...analysis.performance.issues,
      ...analysis.accessibility.issues,
      ...analysis.mobile.issues,
      ...analysis.ux.issues,
      ...analysis.ui.issues,
      ...analysis.functionality.issues,
    ];
    auditData.warnings = [...analysis.ux.warnings];
    auditData.goodPoints = [
      ...analysis.seo.goodPoints,
      ...analysis.security.goodPoints,
      ...analysis.performance.goodPoints,
      ...analysis.accessibility.goodPoints,
    ];

    const loginPath = auditData.pages.find((p) => /login|sign-in|signin/i.test(p));
    auditData.authTests.hasLogin = Boolean(loginPath);
    auditData.authTests.loginPageAccessible = Boolean(loginPath);
    if (loginPath && credentials?.username && credentials?.password) {
      auditData.authTests.details.push(`Credentials were supplied for login test on ${loginPath}.`);
    } else if (loginPath) {
      auditData.authTests.issues.push('Login page found but no credentials supplied.');
    }

    auditData.rating = calculateRating(auditData.issues);
    auditData.advice = auditData.issues.length
      ? 'Prioritize high-severity issues first: fix broken links/buttons, resolve console errors, then improve SEO and accessibility.'
      : 'Great job. The site passed all checks with no major issues found.';

    auditData.totalTime = Date.now() - start;
    auditData.endTime = new Date().toISOString();
    auditData.certificate = {
      issuedAt: new Date().toISOString(),
      score: auditData.rating,
      grade: auditData.rating >= 4.5 ? 'A+' : auditData.rating >= 4 ? 'A' : auditData.rating >= 3 ? 'B' : 'C',
      summary: `Audited ${auditData.pageAudits.length} pages out of ${auditData.pages.length} discovered pages.`
    };

    await home.close();
    await context.close();
  } catch (error) {
    auditData.issues = [{ title: 'Audit failed', description: error.message, severity: 'critical', category: 'Functionality' }];
    auditData.rating = 1;
    auditData.advice = 'Unable to complete the audit due to a runtime error.';
  } finally {
    await browser.close();
  }

  return auditData;
};
