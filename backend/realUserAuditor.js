import { chromium } from 'playwright';

const normalizeUrl = (input) => {
  const url = String(input || '').trim();
  if (!url) throw new Error('URL is required');
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const severity = (kind = 'medium') => kind;

const analyzePage = async (page, pageUrl, baseHost) => {
  const consoleErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  page.on('console', onConsole);

  const started = Date.now();
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const toText = (el) => (el?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    const title = document.title || '';
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const viewport = !!document.querySelector('meta[name="viewport"]');
    const ogTitle = !!document.querySelector('meta[property="og:title"]');
    const h1Count = document.querySelectorAll('h1').length;

    const buttonCandidates = Array.from(document.querySelectorAll('button, a[role="button"], input[type="submit"], input[type="button"]'));
    const visibleButtons = buttonCandidates.filter((el) => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return r.width > 8 && r.height > 8 && style.visibility !== 'hidden' && style.display !== 'none';
    });
    const buttonDetails = visibleButtons.slice(0, 20).map((el) => ({
      label: toText(el) || el.getAttribute('aria-label') || '(unlabeled button)',
      disabled: el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true'
    }));

    const links = Array.from(document.querySelectorAll('a[href]'));
    const loginLink = links.find((a) => /login|sign\s?in/i.test((a.textContent || '') + (a.getAttribute('href') || '')))?.getAttribute('href') || null;
    const signupLink = links.find((a) => /sign\s?up|register|create\saccount/i.test((a.textContent || '') + (a.getAttribute('href') || '')))?.getAttribute('href') || null;

    return {
      title,
      metaDescription,
      canonical,
      viewport,
      ogTitle,
      h1Count,
      buttonsTotal: visibleButtons.length,
      buttonDetails,
      forms: document.querySelectorAll('form').length,
      linksTotal: links.length,
      loginLink,
      signupLink,
      hasPasswordInput: !!document.querySelector('input[type="password"]')
    };
  });

  const buttonHealth = {
    total: data.buttonsTotal,
    working: data.buttonDetails.filter((b) => !b.disabled).length,
    notWorking: data.buttonDetails.filter((b) => b.disabled).length,
    details: data.buttonDetails.map((b) => `${b.disabled ? 'NOT WORKING' : 'WORKING'}: ${b.label}`)
  };

  const issues = [];
  const goodPoints = [];

  if (!data.title) issues.push({ title: 'Missing title tag', description: 'Page has no <title>.', severity: severity('high'), category: 'SEO' });
  else goodPoints.push('Title tag is present');
  if (!data.metaDescription) issues.push({ title: 'Missing meta description', description: 'Add a description meta tag.', severity: severity('medium'), category: 'SEO' });
  if (!data.canonical) issues.push({ title: 'Missing canonical URL', description: 'Add canonical URL for SEO consistency.', severity: severity('low'), category: 'SEO' });
  if (!data.ogTitle) issues.push({ title: 'Missing Open Graph tags', description: 'Add Open Graph tags for social sharing.', severity: severity('low'), category: 'SEO' });
  if (!data.viewport) issues.push({ title: 'Missing viewport meta tag', description: 'Mobile rendering may be broken.', severity: severity('high'), category: 'Mobile' });
  if (data.h1Count !== 1) issues.push({ title: 'Heading structure issue', description: `Expected 1 H1, found ${data.h1Count}.`, severity: severity('medium'), category: 'SEO' });

  if (consoleErrors.length > 0) {
    issues.push({ title: 'Console errors detected', description: `${consoleErrors.length} console errors found on page.`, severity: severity('high'), category: 'Functionality' });
  } else {
    goodPoints.push('No console errors detected during page visit');
  }

  const perfMs = Date.now() - started;
  if (perfMs > 5000) issues.push({ title: 'Slow page load', description: `Load time ${perfMs}ms is high.`, severity: severity('medium'), category: 'Performance' });

  const rating = Number(Math.max(1, 5 - (issues.length * 0.3)).toFixed(1));
  page.off('console', onConsole);

  return {
    path: new URL(pageUrl).pathname || '/',
    url: pageUrl,
    loaded: true,
    rating,
    totalIssues: issues.length,
    loadTime: perfMs,
    consoleErrors,
    buttons: buttonHealth,
    seoMeta: {
      title: data.title,
      metaDescription: data.metaDescription,
      canonical: data.canonical,
      viewport: data.viewport,
      ogTitle: data.ogTitle
    },
    authHints: {
      loginLink: data.loginLink,
      signupLink: data.signupLink,
      hasPasswordInput: data.hasPasswordInput
    },
    analysis: {
      seo: { issues: issues.filter((i) => i.category === 'SEO'), goodPoints, warnings: [] },
      security: { issues: [], goodPoints: pageUrl.startsWith('https://') ? ['HTTPS enabled'] : [], warnings: [] },
      performance: { issues: issues.filter((i) => i.category === 'Performance'), goodPoints: [], warnings: [] },
      accessibility: { issues: [], goodPoints: [], warnings: [] },
      mobile: { issues: issues.filter((i) => i.category === 'Mobile'), goodPoints: [], warnings: [] },
      ux: { issues: [], goodPoints: [], warnings: [] },
      ui: { issues: [], goodPoints: [], warnings: [] },
      functionality: { issues: issues.filter((i) => i.category === 'Functionality'), goodPoints: [], warnings: [] }
    },
    issues,
    goodPoints
  };
};

const discoverPages = async (page, baseUrl, limit = 20) => {
  const base = new URL(baseUrl);
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')).filter(Boolean));
  const seen = new Set(['/']);
  for (const href of links) {
    try {
      const u = new URL(href, baseUrl);
      if (u.host !== base.host) continue;
      if (/\.(pdf|jpg|jpeg|png|gif|svg|zip|docx?)$/i.test(u.pathname)) continue;
      seen.add(u.pathname || '/');
    } catch {}
  }
  return Array.from(seen).slice(0, limit);
};

export const auditWebsiteWithBrowser = async (inputUrl, credentials = {}) => {
  const url = normalizeUrl(inputUrl);
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const start = Date.now();
  const auditData = {
    url,
    startTime: new Date().toISOString(),
    pages: [],
    pageAudits: [],
    issues: [],
    warnings: [],
    goodPoints: [],
    rating: 0,
    advice: '',
    authTests: { hasLogin: false, hasSignup: false, loginPageAccessible: false, signupPageAccessible: false, socialLoginAvailable: false, issues: [], details: [] },
    interactiveTests: { buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] }, forms: { total: 0, working: 0, broken: 0, details: [] }, links: { total: 0, working: 0, broken: 0, details: [] }, navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] }, modals: { found: 0, closable: 0, details: [] } },
    techStack: { frameworks: [], libraries: [], analytics: [], cms: [], ecommerce: [], fonts: [] },
    seoAnalysis: { issues: [], goodPoints: [], warnings: [] },
    securityAnalysis: { issues: [], goodPoints: [], warnings: [] },
    performanceAnalysis: { issues: [], goodPoints: [], warnings: [] },
    accessibilityAnalysis: { issues: [], goodPoints: [], warnings: [] },
    mobileAnalysis: { issues: [], goodPoints: [], warnings: [] },
    uxAnalysis: { issues: [], goodPoints: [], warnings: [] },
    uiAnalysis: { issues: [], goodPoints: [], warnings: [] },
    functionalityAnalysis: { issues: [], goodPoints: [], warnings: [] }
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    auditData.pages = await discoverPages(page, url, 20);

    for (const path of auditData.pages) {
      const pageUrl = new URL(path, url).toString();
      try {
        const result = await analyzePage(page, pageUrl, new URL(url).host);
        auditData.pageAudits.push(result);
        auditData.issues.push(...result.issues.map((i) => ({ ...i, title: `[${result.path}] ${i.title}` })));
        auditData.goodPoints.push(...result.goodPoints.map((g) => `[${result.path}] ${g}`));
        if (result.authHints.loginLink) {
          auditData.authTests.hasLogin = true;
          auditData.authTests.loginPageAccessible = true;
        }
        if (result.authHints.signupLink) {
          auditData.authTests.hasSignup = true;
          auditData.authTests.signupPageAccessible = true;
        }
      } catch (e) {
        auditData.pageAudits.push({ path, url: pageUrl, loaded: false, error: e.message, errors: [e.message] });
        auditData.issues.push({ title: `[${path}] Page failed to load`, description: e.message, severity: 'high', category: 'Functionality' });
      }
    }

    const loaded = auditData.pageAudits.filter((p) => p.loaded && p.rating);
    auditData.rating = loaded.length ? Number((loaded.reduce((a, b) => a + b.rating, 0) / loaded.length).toFixed(1)) : 1.0;

    auditData.interactiveTests.buttons.total = loaded.reduce((sum, p) => sum + (p.buttons?.total || 0), 0);
    auditData.interactiveTests.buttons.working = loaded.reduce((sum, p) => sum + (p.buttons?.working || 0), 0);
    auditData.interactiveTests.buttons.broken = loaded.reduce((sum, p) => sum + (p.buttons?.notWorking || 0), 0);
    auditData.interactiveTests.buttons.clickable = auditData.interactiveTests.buttons.working;
    auditData.interactiveTests.buttons.details = loaded.flatMap((p) => (p.buttons?.details || []).slice(0, 5)).slice(0, 40);

    if (auditData.authTests.hasLogin && !(credentials.username && credentials.password)) {
      auditData.authTests.issues.push('Login page detected. Provide credentials to validate authenticated pages.');
      auditData.authTests.details.push('Credentials were not supplied with this audit request.');
    } else if (auditData.authTests.hasLogin) {
      auditData.authTests.details.push('Credentials were supplied and are ready for authenticated flow testing.');
    }

    auditData.advice = `Audited ${auditData.pages.length} total pages (${loaded.length} loaded successfully). Found ${auditData.issues.length} issues. Focus on SEO meta tags, console errors, and disabled/non-working buttons first.`;
    auditData.endTime = new Date().toISOString();
    auditData.totalTime = Date.now() - start;

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    auditData.screenshots = {
      desktop: await page.screenshot({ encoding: 'base64', fullPage: false }),
    };
  } finally {
    await browser.close();
  }

  return auditData;
};
