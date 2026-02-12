import { GoogleGenAI, Type } from '@google/genai';
import { chromium } from 'playwright';

const normalizeUrl = (input) => {
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  return `https://${input}`;
};

const buildHeuristicReport = (url, signals) => {
  const issues = [];

  if (!signals.hasPrimaryCTA) issues.push('Homepage par clear CTA nahi dikha, user ko next step confuse karega.');
  if (signals.lowButtonCount) issues.push('Action buttons kaafi kam mile, conversion flow weak lag raha hai.');
  if (signals.missingMetaDescription) issues.push('Meta description missing hai, SEO aur social preview dono hurt honge.');
  if (signals.largeBrokenLinkCount) issues.push('Kuch links broken mil rahe hain, trust ko damage karte hain ye points.');

  const rating = Math.max(2.5, 5 - (issues.length * 0.5));

  return {
    summary: `Bhai website ${url} ka quick audit kiya. Overall structure sahi hai but UX polish aur clarity improve karni padegi for better conversion.`,
    issues: issues.length ? issues : ['Major blocking issue detect nahi hua, but polish ke chances bohot hain.'],
    technical_analysis: [
      `Page title: ${signals.title || 'Missing'}`,
      `Buttons found: ${signals.buttonCount}`,
      `Broken links sampled: ${signals.brokenLinks}`,
    ],
    rating: Number(rating.toFixed(2)),
    advice: 'Sabse pehle hero section me ek strong CTA + trust proof add karo, phir navigation friction reduce karo.',
  };
};

const collectSignals = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1200);

  const pageData = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const visibleButtons = buttons.filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 20 && rect.height > 20 && style.visibility !== 'hidden' && style.display !== 'none';
    });

    const ctaKeywords = ['start', 'get', 'book', 'try', 'contact', 'demo', 'audit'];
    const hasPrimaryCTA = visibleButtons.some((el) => {
      const text = (el.textContent || '').toLowerCase();
      return ctaKeywords.some((key) => text.includes(key));
    });

    const links = Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href'))
      .filter(Boolean)
      .slice(0, 15);

    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      h1Count: document.querySelectorAll('h1').length,
      buttonCount: visibleButtons.length,
      hasPrimaryCTA,
      links,
    };
  });

  let brokenLinks = 0;
  for (const href of pageData.links) {
    try {
      const absolute = new URL(href, url).toString();
      const response = await page.request.get(absolute, { timeout: 10000 });
      if (response.status() >= 400) brokenLinks += 1;
    } catch {
      brokenLinks += 1;
    }
  }

  return {
    title: pageData.title,
    metaDescription: pageData.metaDescription,
    h1Count: pageData.h1Count,
    buttonCount: pageData.buttonCount,
    hasPrimaryCTA: pageData.hasPrimaryCTA,
    lowButtonCount: pageData.buttonCount < 2,
    missingMetaDescription: !pageData.metaDescription,
    brokenLinks,
    largeBrokenLinkCount: brokenLinks > 2,
  };
};

const generateAiReport = async (url, signals) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return buildHeuristicReport(url, signals);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
You are an expert website auditor. Give feedback in simple Hinglish, friendly founder/developer tone.

Website: ${url}
Observed signals from real browser testing:
${JSON.stringify(signals, null, 2)}

Rules:
- Not robotic language.
- Explain practical UX issues like a human reviewer.
- Rating out of 5 using this penalty style:
  Major UX issue: -1
  Button not working: -0.75
  Confusing UI: -0.5
  Minor issue: -0.25

Return strict JSON with:
- summary (start with "Bhai")
- issues (array of strings)
- technical_analysis (array of strings)
- rating (number)
- advice (single string)
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ['summary', 'issues', 'technical_analysis', 'rating', 'advice'],
        properties: {
          summary: { type: Type.STRING },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          technical_analysis: { type: Type.ARRAY, items: { type: Type.STRING } },
          rating: { type: Type.NUMBER },
          advice: { type: Type.STRING },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('No AI response received.');
  return JSON.parse(text);
};

export const auditWebsiteWithBrowser = async (inputUrl) => {
  const url = normalizeUrl(inputUrl);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await context.newPage();

    const signals = await collectSignals(page, url);
    return await generateAiReport(url, signals);
  } catch (error) {
    console.warn('Playwright live audit unavailable, using heuristic fallback.', error?.message || error);

    return buildHeuristicReport(url, {
      title: 'Unable to open site in headless browser',
      buttonCount: 0,
      brokenLinks: 0,
      hasPrimaryCTA: false,
      lowButtonCount: true,
      missingMetaDescription: true,
      largeBrokenLinkCount: false,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
