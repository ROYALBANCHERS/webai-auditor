import { AuditResult } from "../types";

// API base URL - empty in prod (same origin), or set via env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export const auditWebsite = async (url: string): Promise<AuditResult> => {
  // Normalize URL
  const normalizedUrl = url.trim();
  if (!normalizedUrl) {
    throw new Error('URL is required');
  }

  // Add protocol if missing
  let fullUrl = normalizedUrl;
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    fullUrl = `https://${normalizedUrl}`;
  }

  console.log(`Starting audit for: ${fullUrl}`);

  // Try backend API first
  if (API_BASE_URL || !import.meta.env.PROD) {
    try {
      const apiUrl = API_BASE_URL
        ? `${API_BASE_URL}/api/audit`
        : '/api/audit';

      console.log(`Calling API: ${apiUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fullUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);

      return data as AuditResult;
    } catch (error: any) {
      console.error('API call failed:', error);

      // If it's an abort error, it's a timeout
      if (error.name === 'AbortError') {
        throw new Error('Website took too long to respond. Try again or check if the site is online.');
      }

      // For network errors in production, show helpful message
      if (import.meta.env.PROD && error.message?.includes('fetch')) {
        throw new Error('Backend service is currently unavailable. Please try again later.');
      }

      throw error;
    }
  }

  // Fallback for production without backend (show demo mode)
  return {
    url: fullUrl,
    auditDate: new Date().toISOString(),
    loadTime: 2500,
    summary: `Bhai ${fullUrl} ka audit complete kiya. Backend service connected nahi ho pa raha - demo mode me results aa rahe hain. Real ke liye backend start karo.`,
    issues: [
      {
        title: 'Demo Mode',
        description: 'Backend server is not connected. Start the backend server to get real AI-powered audits.',
        severity: 'medium',
        category: 'Functionality',
      },
    ],
    technical_analysis: [
      'Backend: Not Connected',
      'Frontend: Working',
      'Action: Start backend with `npm run dev:backend`',
    ],
    highlights: [
      'Frontend is working',
      'Ready to connect to backend',
    ],
    rating: 3.5,
    advice: 'Backend server start karo: `npm run dev:backend`. Phir se audit try karo.',
  };
};

// Health check for backend
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const apiUrl = API_BASE_URL
      ? `${API_BASE_URL}/api/health`
      : '/api/health';

    const response = await fetch(apiUrl);
    return response.ok;
  } catch {
    return false;
  }
};
