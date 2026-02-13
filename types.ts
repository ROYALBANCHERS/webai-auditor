export interface AuditResult {
  url?: string;
  auditDate?: string;
  loadTime?: number;
  summary: string;
  issues: Issue[];
  technical_analysis: string[];
  rating: number;
  advice: string;
  highlights?: string[];
  error?: string;
}

export interface Issue {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'UI' | 'UX' | 'Functionality' | 'Performance' | 'Accessibility' | 'SEO';
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export enum Page {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  BLOGS = 'BLOGS',
  BLOG_POST = 'BLOG_POST',
  AI_NEWS = 'AI_NEWS',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  CONTACT = 'CONTACT',
  PRICING = 'PRICING',
  API_DOCS = 'API_DOCS',
  HELP_CENTER = 'HELP_CENTER',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  COOKIES = 'COOKIES'
}
