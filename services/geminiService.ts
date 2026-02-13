import { AuditResult, AuditResultLegacy } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export const auditWebsite = async (url: string, credentials?: { username?: string; password?: string }): Promise<AuditResult> => {
  const normalizedUrl = url.trim();
  if (!normalizedUrl) throw new Error('URL is required');

  const fullUrl = normalizedUrl.match(/^https?:\/\//i) ? normalizedUrl : `https://${normalizedUrl}`;

  if (API_BASE_URL || !import.meta.env.PROD) {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/audit` : '/api/audit';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl, credentials }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if ('techStack' in data || 'pageAudits' in data || 'authTests' in data || 'screenshots' in data) return data as AuditResult;

      return {
        ...data,
        techStack: { frameworks: [], libraries: [], analytics: [], cms: [], ecommerce: [], fonts: [] },
        pages: [],
        pageAudits: [],
        interactiveTests: {
          buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] },
          forms: { total: 0, working: 0, broken: 0, details: [] },
          links: { total: 0, working: 0, broken: 0, details: [] },
          navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] },
          modals: { found: 0, closable: 0, details: [] }
        },
        authTests: {
          hasLogin: false,
          hasSignup: false,
          loginPageAccessible: false,
          signupPageAccessible: false,
          socialLoginAvailable: false,
          issues: [],
          details: (data as AuditResultLegacy).technical_analysis || []
        },
        screenshots: {},
        goodPoints: (data as AuditResultLegacy).highlights || []
      };
    } catch (error: any) {
      if (error.name === 'AbortError') throw new Error('Website took too long to respond. Please try again.');
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    url: fullUrl,
    auditDate: new Date().toISOString(),
    techStack: { frameworks: [], libraries: [], analytics: [], cms: [], ecommerce: [], fonts: [] },
    pages: [],
    pageAudits: [],
    interactiveTests: {
      buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] },
      forms: { total: 0, working: 0, broken: 0, details: [] },
      links: { total: 0, working: 0, broken: 0, details: [] },
      navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] },
      modals: { found: 0, closable: 0, details: [] }
    },
    authTests: {
      hasLogin: false,
      hasSignup: false,
      loginPageAccessible: false,
      signupPageAccessible: false,
      socialLoginAvailable: false,
      issues: [],
      details: []
    },
    issues: [{ title: 'Demo Mode', description: 'Backend server is not connected. Start the backend for live audits.', severity: 'medium', category: 'Functionality' }],
    warnings: [],
    goodPoints: ['Frontend is running'],
    rating: 3.0,
    advice: 'Start backend with `npm run dev:backend` and run the audit again.',
    screenshots: {},
    loadTime: 0
  };
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health';
    const response = await fetch(apiUrl);
    return response.ok;
  } catch {
    return false;
  }
};
