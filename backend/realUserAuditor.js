// ============================================
// REAL USER STYLE WEBSITE AUDITOR - Per Page Analysis
// Like a real human browsing each page individually
// Works with ANY tech stack - React, Vue, Angular, vanilla, AI-generated (v0, Claude, Cursor)
// No AI dependency - pure technical analysis
// ============================================

import { chromium } from 'playwright';

const normalizeUrl = (input) => {
  const url = input.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main audit function
export const auditWebsiteWithBrowser = async (inputUrl) => {
  const url = normalizeUrl(inputUrl);
  let browser;

  const auditData = {
    url,
    startTime: new Date().toISOString(),
    techStack: {},
    pages: [],
    interactiveTests: {},
    authTests: {},
    issues: [],
    warnings: [],
    goodPoints: [],
    rating: 0,
    advice: '',
    pageAudits: [] // NEW: Detailed per-page analysis with individual ratings
  };

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 Starting COMPREHENSIVE TECH AUDIT for: ${url}`);
    console.log(`👨 Acting like REAL HUMAN - testing each page individually`);
    console.log(`${'='.repeat(60)}\n`);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    page.setDefaultTimeout(15000);

    // STEP 1: Visit homepage and detect tech stack
    console.log('📄 Loading homepage...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(3000);

    console.log('🔧 Detecting tech stack (all frameworks)...');
    auditData.techStack = await detectTechStack(page);
    console.log(`   Found: ${auditData.techStack.frameworks.length} frameworks, ${auditData.techStack.libraries.length} libraries`);

    // STEP 2: Discover all pages
    console.log('\n🗺️ Discovering site pages...');
    const discoveredPages = await discoverAllPages(page, url, 15);
    auditData.pages = discoveredPages;

    // Limit pages to test for detailed analysis (to keep audit time reasonable)
    const pagesToTest = discoveredPages.slice(0, 8); // Test up to 8 pages

    console.log(`\n👨 Will act like REAL HUMAN testing ${pagesToTest.length} pages individually...\n`);
    console.log(`${'='.repeat(60)}\n`);

    const pageAuditResults = [];

    // Test EACH page with ALL analyses (SEO, Security, Performance, Accessibility, Mobile, UX, UI, Functionality)
    for (let i = 0; i < pagesToTest.length; i++) {
      const pagePath = pagesToTest[i];
      try {
        const pageUrl = new URL(pagePath, url).toString();
        console.log(`\n📄 [${i + 1}/${pagesToTest.length}] Testing page: ${pagePath}`);
        console.log(`${'='.repeat(40)}\n`);

        // Navigate to page
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await sleep(2000);

        // Run COMPLETE analysis on this specific page
        const pageAnalysis = {};
        let totalIssuesOnPage = 0;

        // 1. SEO Analysis
        console.log('   🔍 SEO check...');
        const seoResult = await analyzeSEO(page);
        pageAnalysis.seo = seoResult;
        const seoIssues = seoResult.issues.length;
        const seoGood = seoResult.goodPoints.length;
        totalIssuesOnPage += seoIssues;
        console.log(`      Issues: ${seoIssues}, Good: ${seoGood}`);

        // 2. Security Analysis
        console.log('   🔐 Security check...');
        const securityResult = await analyzeSecurity(page, pageUrl);
        pageAnalysis.security = securityResult;
        const securityIssues = securityResult.issues.length;
        const securityGood = securityResult.goodPoints.length;
        totalIssuesOnPage += securityIssues;
        console.log(`      Issues: ${securityIssues}, Good: ${securityGood}`);

        // 3. Performance Analysis
        console.log('   ⚡ Performance check...');
        const perfResult = await analyzePerformance(page, pageUrl);
        pageAnalysis.performance = perfResult;
        const perfIssues = perfResult.issues.length;
        const perfGood = perfResult.goodPoints.length;
        totalIssuesOnPage += perfIssues;
        console.log(`      Issues: ${perfIssues}, Good: ${perfGood}`);

        // 4. Accessibility Analysis
        console.log('   ♿ Accessibility check...');
        const a11yResult = await analyzeAccessibility(page);
        pageAnalysis.accessibility = a11yResult;
        const a11yIssues = a11yResult.issues.length;
        const a11yGood = a11yResult.goodPoints.length;
        totalIssuesOnPage += a11yIssues;
        console.log(`      Issues: ${a11yIssues}, Good: ${a11yGood}`);

        // 5. Mobile Analysis
        console.log('   📱 Mobile check...');
        const mobileResult = await analyzeMobile(page, pageUrl);
        pageAnalysis.mobile = mobileResult;
        const mobileIssues = mobileResult.issues.length;
        const mobileGood = mobileResult.goodPoints.length;
        totalIssuesOnPage += mobileIssues;
        console.log(`      Issues: ${mobileIssues}, Good: ${mobileGood}`);

        // 6. UX Analysis
        console.log('   👥 UX check...');
        const uxResult = await analyzeUX(page);
        pageAnalysis.ux = uxResult;
        const uxIssues = uxResult.issues.length;
        const uxGood = uxResult.goodPoints.length;
        totalIssuesOnPage += uxIssues;
        console.log(`      Issues: ${uxIssues}, Good: ${uxGood}`);

        // 7. UI Analysis
        console.log('   🎨 UI check...');
        const uiResult = await analyzeUI(page);
        pageAnalysis.ui = uiResult;
        const uiIssues = uiResult.issues.length;
        const uiGood = uiResult.goodPoints.length;
        totalIssuesOnPage += uiIssues;
        console.log(`      Issues: ${uiIssues}, Good: ${uiGood}`);

        // 8. Functionality Analysis
        console.log('   ⚙️ Functionality check...');
        const funcResult = await analyzeFunctionality(page);
        pageAnalysis.functionality = funcResult;
        const funcIssues = funcResult.issues.length;
        const funcGood = funcResult.goodPoints.length;
        totalIssuesOnPage += funcIssues;
        console.log(`      Issues: ${funcIssues}, Good: ${funcGood}`);

        // Calculate individual page rating (0-5)
        let pageRating = 5.0;

        // Deduct for issues on THIS page (weighted by severity)
        const issueWeights = {
          critical: 2.0, high: 1.5, medium: 1.0, low: 0.5
        };

        [...seoResult.issues, ...securityResult.issues, ...perfResult.issues,
         ...a11yResult.issues, ...mobileResult.issues, ...uxResult.issues,
         ...uiResult.issues, ...funcResult.issues].forEach(issue => {
          pageRating -= (issueWeights[issue.severity] || 0.5);
        });

        // Bonus for good points on THIS page
        const totalGoodPoints = seoGood + securityGood + perfGood + a11yGood +
                                   mobileGood + uxGood + uiGood + funcGood;
        pageRating += Math.min(0.5, totalGoodPoints * 0.05);

        // Ensure rating is between 1 and 5
        pageRating = Math.max(1.0, Math.min(5.0, pageRating));
        pageRating = Number(pageRating.toFixed(1));

        console.log(`   ⭐ Page Rating: ${pageRating}/5 (${totalIssuesOnPage} total issues)\n`);

        // Store this page's detailed analysis
        pageAuditResults.push({
          path: pagePath,
          url: pageUrl,
          loaded: true,
          rating: pageRating,
          totalIssues: totalIssuesOnPage,
          analysis: pageAnalysis,
          // Category breakdown for UI display
          seo: { issues: seoIssues, goodPoints: seoGood, issuesCount: seoIssues.length },
          security: { issues: securityIssues, goodPoints: securityGood, issuesCount: securityIssues.length },
          performance: { issues: perfIssues, goodPoints: perfGood, issuesCount: perfIssues.length },
          accessibility: { issues: a11yIssues, goodPoints: a11yGood, issuesCount: a11yIssues.length },
          mobile: { issues: mobileIssues, goodPoints: mobileGood, issuesCount: mobileIssues.length },
          ux: { issues: uxIssues, goodPoints: uxGood, issuesCount: uxIssues.length },
          ui: { issues: uiIssues, goodPoints: uiGood, issuesCount: uiIssues.length },
          functionality: { issues: funcIssues, goodPoints: funcGood, issuesCount: funcIssues.length }
        });

      } catch (e) {
        console.error(`   ❌ Error testing ${pagePath}:`, e.message);
        pageAuditResults.push({
          path: pagePath,
          url: new URL(pagePath, url).toString(),
          loaded: false,
          rating: 0,
          totalIssues: 999,
          error: e.message
        });
      }
    }

    // Store page audits in main data
    auditData.pageAudits = pageAuditResults;

    // Calculate OVERALL rating as AVERAGE of all tested pages
    const validPageRatings = pageAuditResults
      .filter(p => p.loaded && p.rating > 0)
      .map(p => p.rating);

    if (validPageRatings.length > 0) {
      const sumRatings = validPageRatings.reduce((sum, r) => sum + r, 0);
      auditData.rating = Number((sumRatings / validPageRatings.length).toFixed(1));
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📊 OVERALL RATING: ${auditData.rating}/5 (average of ${validPageRatings.length} tested pages)\n`);
    } else {
      auditData.rating = 3.0;
      console.log('\n📊 OVERALL RATING: 3.0/5 (no valid pages tested)\n');
    }

    // Collect ALL issues from ALL pages into main issues list with page prefix
    pageAuditResults.forEach(pageAudit => {
      if (pageAudit.analysis && pageAudit.loaded) {
        Object.values(pageAudit.analysis || {}).forEach(analysis => {
          if (analysis.issues) {
            auditData.issues.push(...analysis.issues.map(issue => ({
              title: `[${pageAudit.path}] ${issue.title}`,
              description: issue.description,
              severity: issue.severity,
              category: issue.category
            })));
          }
          if (analysis.goodPoints) {
            auditData.goodPoints.push(...analysis.goodPoints.map(point => `[${pageAudit.path}] ${point}`));
          }
          if (analysis.warnings) {
            auditData.warnings.push(...analysis.warnings.map(warning => ({
              title: `[${pageAudit.path}] ${warning.title}`,
              description: warning.description,
              category: warning.category || 'General'
            })));
          }
        });
      }
    });

    // Test auth flow (on main page)
    console.log('\n🔐 Testing login/signup flow...');
    auditData.authTests = await testAuthFlow(page, url);

    // Take screenshots
    console.log('\n📸 Taking screenshots...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1500);
    const desktopScreenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1500);
    const mobileScreenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    auditData.screenshots = {
      desktop: desktopScreenshot,
      mobile: mobileScreenshot
    };

    // Generate advice
    auditData.advice = generateComprehensiveAdvice(auditData);

    auditData.endTime = new Date().toISOString();
    auditData.totalTime = Date.now() - Date.parse(auditData.startTime);

    console.log(`\n${'='.repeat(60)}\n`);
    console.log(`✅ AUDIT COMPLETE! Rating: ${auditData.rating}/5\n`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('\n❌ Audit Error:', error);

    auditData.issues = [{
      title: 'Audit Failed',
      description: `Could not complete audit: ${error.message}`,
      severity: 'critical',
      category: 'Functionality'
    }];
    auditData.rating = 1.0;
    auditData.advice = 'Website appears to be down or blocking automated access. Please check if the site is live.';
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return auditData;
};

// Need to export all required functions
export { detectTechStack, analyzeSEO, analyzeSecurity, analyzePerformance, analyzeAccessibility, analyzeMobile, analyzeUX, analyzeUI, analyzeFunctionality };
