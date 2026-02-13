import { GoogleGenAI, Type } from '@google/genai';
import { chromium } from 'playwright';

// URL normalization
const normalizeUrl = (input) => {
  const url = input.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// Screenshot capture for AI visual analysis
const captureScreenshots = async (page, url) => {
  const screenshots = [];

  try {
    // Desktop view
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const desktopShot = await page.screenshot({ encoding: 'base64', fullPage: false });
    screenshots.push({ type: 'desktop', image: desktopShot });

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const mobileShot = await page.screenshot({ encoding: 'base64', fullPage: false });
    screenshots.push({ type: 'mobile', image: mobileShot });

    return screenshots;
  } catch (error) {
    console.warn('Screenshot capture failed:', error.message);
    return [];
  }
};

// Collect comprehensive website signals
const collectWebsiteSignals = async (page, url) => {
  const startTime = Date.now();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    // Continue anyway
  }

  // Wait for page to stabilize
  await page.waitForTimeout(2000);

  // Extract page data
  const pageData = await page.evaluate(() => {
    const getMetaTags = () => {
      const metaTags = {};
      document.querySelectorAll('meta').forEach(tag => {
        const name = tag.getAttribute('name') || tag.getAttribute('property');
        if (name) metaTags[name] = tag.getAttribute('content');
      });
      return metaTags;
    };

    const analyzeButtons = () => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a[class*="btn"], a[class*="Btn"], a[class*="button"]'));
      const visibleButtons = buttons.filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 10 && rect.height > 10 &&
               style.visibility !== 'hidden' &&
               style.display !== 'none' &&
               style.opacity !== '0';
      });

      const ctaKeywords = ['start', 'get started', 'sign up', 'register', 'buy now', 'order now', 'book now', 'try free', 'contact', 'demo', 'subscribe', 'join', 'learn more'];
      const hasPrimaryCTA = visibleButtons.some(el => {
        const text = (el.textContent || '').toLowerCase().trim();
        return ctaKeywords.some(key => text.includes(key)) && text.length < 50;
      });

      const buttonTexts = visibleButtons.slice(0, 10).map(el => el.textContent?.trim()).filter(Boolean);

      return {
        totalButtons: buttons.length,
        visibleButtons: visibleButtons.length,
        hasPrimaryCTA,
        buttonTexts,
      };
    };

    const analyzeNavigation = () => {
      const nav = document.querySelector('nav, [role="navigation"], header nav, .navbar, .navigation');
      const navLinks = nav ? Array.from(nav.querySelectorAll('a[href]')).length : 0;

      const hasLogo = !!document.querySelector('img[alt*="logo" i], img[src*="logo" i], .logo, [class*="brand"]');

      return {
        hasNav: !!nav,
        navLinks,
        hasLogo,
      };
    };

    const analyzeForms = () => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');

      let hasEmailForm = false;
      let hasSearchForm = false;

      forms.forEach(form => {
        const hasEmailInput = form.querySelector('input[type="email"], input[name*="email" i]');
        const hasSearchInput = form.querySelector('input[type="search"], input[name*="search" i]');
        if (hasEmailInput) hasEmailForm = true;
        if (hasSearchInput) hasSearchForm = true;
      });

      return {
        formCount: forms.length,
        inputCount: inputs.length,
        hasEmailForm,
        hasSearchForm,
      };
    };

    const analyzeContent = () => {
      const h1s = Array.from(document.querySelectorAll('h1'));
      const h2s = document.querySelectorAll('h2').length;
      const paragraphs = document.querySelectorAll('p').length;
      const images = document.querySelectorAll('img').length;

      const hasHeroSection = !!(
        document.querySelector('.hero, .hero-section, [class*="Hero"]') ||
        (h1s.length === 1 && h1s[0].parentElement?.querySelector('p'))
      );

      return {
        h1Count: h1s.length,
        h1Text: h1s[0]?.textContent?.trim() || '',
        h2Count: h2s,
        paragraphCount: paragraphs,
        imageCount: images,
        hasHeroSection,
        wordCount: document.body.textContent.split(/\s+/).filter(Boolean).length,
      };
    };

    const analyzeAccessibility = () => {
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.getAttribute('alt'));
      const linksWithoutText = Array.from(document.querySelectorAll('a')).filter(a => !a.textContent?.trim() && !a.getAttribute('aria-label'));

      const hasAriaLabels = !!document.querySelector('[aria-label], [aria-labelledby]');
      const hasSkipLinks = !!document.querySelector('a[href^="#main"], a[href^="#content"], [class*="skip"]');

      return {
        imagesWithoutAlt: imagesWithoutAlt.length,
        linksWithoutText: linksWithoutText.length,
        hasAriaLabels,
        hasSkipLinks,
      };
    };

    const analyzePerformanceSignals = () => {
      const scripts = document.querySelectorAll('script[src]').length;
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]').length;
      const hasLazyLoading = !!document.querySelector('img[loading="lazy"], iframe[loading="lazy"]');

      return {
        externalScripts: scripts,
        stylesheets,
        hasLazyLoading,
      };
    };

    const detectBrokenElements = () => {
      const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
        return !img.complete || img.naturalHeight === 0;
      }).length;

      const emptyLinks = Array.from(document.querySelectorAll('a[href]')).filter(a => {
        const href = a.getAttribute('href');
        return href === '#' || href === 'javascript:void(0)' || href === 'javascript:;';
      }).length;

      return { brokenImages, emptyLinks };
    };

    const checkMobileResponsiveness = () => {
      const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
      const hasResponsiveClasses = !!document.querySelector('[class*="md:"], [class*="lg:"], [class*="sm:"]');

      return {
        hasViewportMeta,
        hasResponsiveClasses,
      };
    };

    return {
      title: document.title,
      metaTags: getMetaTags(),
      url: window.location.href,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ...analyzeButtons(),
      ...analyzeNavigation(),
      ...analyzeForms(),
      ...analyzeContent(),
      ...analyzeAccessibility(),
      ...analyzePerformanceSignals(),
      ...detectBrokenElements(),
      ...checkMobileResponsiveness(),
    };
  });

  // Check some links for broken status
  const linkCheckResults = await checkRandomLinks(page, url, 5);

  return {
    ...pageData,
    loadTime: Date.now() - startTime,
    linkChecks: linkCheckResults,
  };
};

// Check random links for 404s
const checkRandomLinks = async (page, baseUrl, limit = 5) => {
  const results = [];

  try {
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({ href: a.getAttribute('href'), text: a.textContent?.trim() }))
        .filter(l => l.href && !l.href.startsWith('javascript:') && !l.href.startsWith('#') && !l.href.startsWith('mailto:'))
        .slice(0, limit);
    });

    for (const link of links) {
      try {
        const absoluteUrl = new URL(link.href, baseUrl).toString();
        const response = await page.request.fetch(absoluteUrl, { timeout: 8000 });
        results.push({
          url: link.href,
          text: link.text?.substring(0, 30),
          status: response.status(),
          ok: response.ok(),
        });
      } catch (e) {
        results.push({
          url: link.href,
          text: link.text?.substring(0, 30),
          status: 0,
          ok: false,
        });
      }
    }
  } catch (e) {
    console.warn('Link check failed:', e.message);
  }

  return results;
};

// Calculate rating based on issues
const calculateRating = (issues, signals) => {
  let rating = 5.0;

  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical': rating -= 1.0; break;
      case 'high': rating -= 0.75; break;
      case 'medium': rating -= 0.5; break;
      case 'low': rating -= 0.25; break;
    }
  });

  // Bonus points for good practices
  if (signals.hasPrimaryCTA) rating += 0.2;
  if (signals.hasViewportMeta) rating += 0.1;
  if (signals.hasAriaLabels) rating += 0.1;
  if (signals.hasEmailForm) rating += 0.1;

  return Math.max(1.0, Math.min(5.0, rating));
};

// Generate AI-powered report with visual analysis
const generateAIReport = async (url, signals, screenshots = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateHeuristicReport(url, signals);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Prepare analysis context
    const hasScreenshots = screenshots.length > 0;
    const visualContext = hasScreenshots
      ? `\n\n📸 SCREENSHOTS ATTACHED: ${screenshots.length} screenshots (desktop + mobile) for visual UX analysis.`
      : '';

    const prompt = `You are Bhai - an expert website auditor with a friendly, casual Hinglish tone. You review websites like a real human user would.

🌐 Website to audit: ${url}

📊 Website Data (from real browser navigation):
${JSON.stringify(signals, null, 2)}${visualContext}

🧠 YOUR TASK:
Analyze this website like a REAL USER visiting it. Not a robot - a human.

Check these areas:
1️⃣ UI/UX - Is it clean? Confusing? Professional?
2️⃣ Navigation - Can users find what they need?
3️⃣ CTA - Is the action button clear and visible?
4️⃣ Content - Is the message clear? Too much/too little?
5️⃣ Mobile - Will it work on phones?
6️⃣ Trust - Does it look legitimate?

⭐ RATING SYSTEM (Start from 5, deduct for issues):
- Critical UX issues (can't use site): -1.0 ⭐
- Broken/Dead buttons or links: -0.75 ⭐
- Confusing UI/Navigation: -0.5 ⭐
- Minor issues (small text, missing alt): -0.25 ⭐

Bonus points:
- Clear CTA button: +0.2 ⭐
- Mobile responsive: +0.1 ⭐
- Good accessibility: +0.1 ⭐

📝 RESPONSE FORMAT (Strict JSON):
{
  "summary": "Start with 'Bhai' - explain overall impression in 2-3 sentences",
  "issues": [
    { "title": "Short issue title", "description": "Brief explanation", "severity": "critical|high|medium|low", "category": "UI|UX|Functionality|Performance|Accessibility" }
  ],
  "technical_analysis": ["Technical point 1", "Technical point 2", ...],
  "rating": 4.2,
  "advice": "3-4 sentences of actionable advice in simple Hinglish",
  "highlights": ["What's working well 1", "What's working well 2"]
}

💡 TONE EXAMPLES:
✅ Good: "Bhai homepage pe kaafi clutter hai. Hero section mein bohot saare elements lag rahe hain. User ko samajh nahi aa raha kya karna hai."
❌ Bad: "The website exhibits excessive visual complexity in the hero section."

Remember: Be honest but helpful. Like a friend reviewing a website.`;

    const contents = [{ text: prompt }];

    // Add screenshots if available
    if (screenshots.length > 0) {
      for (const shot of screenshots) {
        contents.push({
          inlineData: {
            mimeType: 'image/png',
            data: shot.image,
          },
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['summary', 'issues', 'technical_analysis', 'rating', 'advice', 'highlights'],
          properties: {
            summary: { type: Type.STRING },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
              },
            },
            technical_analysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            rating: { type: Type.NUMBER },
            advice: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No AI response');

    const result = JSON.parse(text);

    // Ensure rating is within bounds
    result.rating = Math.max(1.0, Math.min(5.0, result.rating));

    // Add technical details
    result.url = url;
    result.auditDate = new Date().toISOString();
    result.loadTime = signals.loadTime;

    return result;
  } catch (error) {
    console.warn('AI generation failed, using heuristic fallback:', error.message);
    return generateHeuristicReport(url, signals);
  }
};

// Heuristic fallback when AI is unavailable
const generateHeuristicReport = (url, signals) => {
  const issues = [];

  // Critical issues
  if (!signals.hasPrimaryCTA) {
    issues.push({
      title: 'Clear CTA Missing',
      description: 'Homepage par koi clear action button nahi dikha. User ko nahi pata kya karna hai.',
      severity: 'high',
      category: 'UX',
    });
  }

  if (signals.brokenImages > 0) {
    issues.push({
      title: 'Broken Images Found',
      description: `${signals.brokenImages} images load nahi ho rahe. Site broken lag rahi hai.`,
      severity: 'medium',
      category: 'Functionality',
    });
  }

  if (!signals.hasViewportMeta) {
    issues.push({
      title: 'Not Mobile Friendly',
      description: 'Viewport meta tag missing hai. Phone pe site toot jayegi.',
      severity: 'critical',
      category: 'UI',
    });
  }

  // UX issues
  if (signals.visibleButtons < 2) {
    issues.push({
      title: 'Less Action Buttons',
      description: 'Action buttons kaafi kam hain. User engage nahi ho pa raha.',
      severity: 'medium',
      category: 'UX',
    });
  }

  if (signals.h1Count === 0) {
    issues.push({
      title: 'H1 Heading Missing',
      description: 'Main heading (H1) nahi hai. SEO aur clarity dono affect honge.',
      severity: 'medium',
      category: 'SEO',
    });
  }

  if (signals.imagesWithoutAlt > 5) {
    issues.push({
      title: 'Alt Text Missing',
      description: `${signals.imagesWithoutAlt} images mein alt text nahi hai. Accessibility poor hai.`,
      severity: 'low',
      category: 'Accessibility',
    });
  }

  if (signals.emptyLinks > 3) {
    issues.push({
      title: 'Empty/Broken Links',
      description: `${signals.emptyLinks} links blank ya dead hain.`,
      severity: 'medium',
      category: 'Functionality',
    });
  }

  // Navigation issues
  if (!signals.hasNav || signals.navLinks < 3) {
    issues.push({
      title: 'Weak Navigation',
      description: 'Navigation ya toh hai hi nahi ya bahut kam links hain.',
      severity: 'medium',
      category: 'UX',
    });
  }

  const highlights = [];
  if (signals.hasPrimaryCTA) highlights.push('Clear CTA button present');
  if (signals.hasViewportMeta) highlights.push('Mobile responsive setup');
  if (signals.hasEmailForm) highlights.push('Lead capture form exists');
  if (signals.hasAriaLabels) highlights.push('Accessibility labels found');

  if (highlights.length === 0) {
    highlights.push('Site is loading successfully');
  }

  const rating = calculateRating(issues, signals);

  return {
    url,
    auditDate: new Date().toISOString(),
    loadTime: signals.loadTime,
    summary: `Bhai ${url} ka audit complete kiya. ${issues.length} issues mile hain. Overall ${rating >= 4 ? 'accha kaam kiya hai' : 'improvement ki zarurat hai'}.`,
    issues,
    technical_analysis: [
      `Page Load Time: ${Math.round(signals.loadTime / 1000)}s`,
      `Total Buttons: ${signals.totalButtons} (Visible: ${signals.visibleButtons})`,
      `Forms Found: ${signals.formCount}`,
      `Images: ${signals.imageCount} (${signals.imagesWithoutAlt} missing alt)`,
      `Links Checked: ${signals.linkChecks.filter(l => l.ok).length}/${signals.linkChecks.length} working`,
    ],
    highlights,
    rating: Number(rating.toFixed(1)),
    advice: issues.length > 0
      ? 'Sabse pehle mobile experience fix karo, phir clear CTA add karo. Technical issues like broken images aur alt text bhi handle kar lo.'
      : 'Site kaafi achhi hai! Thodi UX polish aur conversion rate badha sakte ho.',
  };
};

// Main audit function
export const auditWebsiteWithBrowser = async (inputUrl) => {
  const url = normalizeUrl(inputUrl);
  let browser;
  let screenshots = [];

  try {
    console.log(`🔍 Starting audit for: ${url}`);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Collect signals
    const signals = await collectWebsiteSignals(page, url);

    // Capture screenshots for AI visual analysis
    try {
      screenshots = await captureScreenshots(page, url);
      console.log(`📸 Captured ${screenshots.length} screenshots`);
    } catch (e) {
      console.warn('Screenshot capture failed');
    }

    // Generate report
    const report = await generateAIReport(url, signals, screenshots);

    console.log(`✅ Audit complete. Rating: ${report.rating}/5`);

    return report;

  } catch (error) {
    console.error('Audit error:', error);
    return {
      url,
      auditDate: new Date().toISOString(),
      summary: `Bhai ${url} audit karte time error aa gaya. Site slow hai ya down ho sakta hai.`,
      issues: [{
        title: 'Site Not Accessible',
        description: 'Website load nahi ho raha ya timeout ho gaya. Server issue ho sakta hai.',
        severity: 'critical',
        category: 'Functionality',
      }],
      technical_analysis: ['Could not connect to website', 'Check if website is online'],
      highlights: [],
      rating: 1.0,
      advice: 'Pehle ye check karo ki website live hai ya nahi. Firewalls aur rate limiting bhi issue kar sakti hai.',
      error: error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
