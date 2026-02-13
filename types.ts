export interface AuditResult {
  // Basic info
  id?: string;
  url?: string;
  auditDate?: string;
  endTime?: string;
  totalTime?: number;
  loadTime?: number;
  startTime?: string;

  // Tech stack detection
  techStack?: TechStack;

  // Pages discovered
  pages?: string[];

  // Page by page audits
  pageAudits?: PageAudit[];

  // Interactive tests
  interactiveTests?: InteractiveTests;

  // Auth/Signup tests
  authTests?: AuthTests;

  // Issues
  issues: Issue[];
  warnings?: Warning[];
  goodPoints?: string[];

  // Screenshots
  screenshots?: Screenshots;

  // Rating
  rating: number;

  // Advice
  advice: string;

  // Detailed analysis results (NEW - Comprehensive Analysis)
  seoAnalysis?: AnalysisResult;
  securityAnalysis?: AnalysisResult;
  performanceAnalysis?: AnalysisResult;
  accessibilityAnalysis?: AnalysisResult;
  mobileAnalysis?: AnalysisResult;
  uxAnalysis?: AnalysisResult;
  uiAnalysis?: AnalysisResult;
  functionalityAnalysis?: AnalysisResult;

  // Error
  error?: string;
}

export interface TechStack {
  frameworks: string[];
  libraries: string[];
  analytics: string[];
  cms: string[];
  ecommerce: string[];
  fonts: string[];
  other?: string[];
}

export interface PageAudit {
  path: string;
  url: string;
  loaded: boolean;
  errors?: string[];
  loadTime?: number;
  error?: string;
}

export interface InteractiveTests {
  buttons: {
    total: number;
    clickable: number;
    working: number;
    broken: number;
    details: string[];
  };
  forms: {
    total: number;
    working: number;
    broken: number;
    details: string[];
  };
  links: {
    total: number;
    working: number;
    broken: number;
    details: string[];
  };
  navigation: {
    hasNav: boolean;
    menuItems: number;
    mobileMenuWorks: boolean;
    details: string[];
  };
  modals: {
    found: number;
    closable: number;
    details: string[];
  };
}

export interface AuthTests {
  hasLogin: boolean;
  hasSignup: boolean;
  loginPageAccessible: boolean;
  signupPageAccessible: boolean;
  socialLoginAvailable: boolean;
  issues: string[];
  details: string[];
}

export interface Issue {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'UI' | 'UX' | 'Functionality' | 'Performance' | 'Accessibility' | 'SEO' | 'Security' | 'Mobile';
}

// Detailed analysis result interfaces
export interface AnalysisResult {
  issues: Issue[];
  goodPoints: string[];
  warnings: Warning[];
  data?: any;
}

export interface Warning {
  title: string;
  description: string;
  category: string;
}

export interface Screenshots {
  desktop?: string;
  mobile?: string;
}

// Old format for backward compatibility
export interface AuditResultLegacy {
  summary: string;
  issues: string[] | Issue[];
  technical_analysis: string[];
  rating: number;
  advice: string;
  highlights?: string[];
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
  COOKIES = 'COOKIES',
  LOGIN = 'LOGIN'
}
