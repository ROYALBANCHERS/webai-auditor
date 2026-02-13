import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Loader } from './components/Loader';
import { Results } from './components/Results';
import { LoginPage } from './components/pages/LoginPage';
import { Services } from './components/pages/Services';
import { Blogs } from './components/pages/Blogs';
import { BlogPost } from './components/pages/BlogPost';
import { AINews } from './components/pages/AINews';
import { HowItWorks } from './components/pages/HowItWorks';
import { Contact } from './components/pages/Contact';
import { Pricing } from './components/pages/Pricings';
import { ApiDocs } from './components/pages/ApiDocs';
import { HelpCenter } from './components/pages/HelpCenter';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { CookiePolicy } from './components/pages/CookiePolicy';
import { AppState, AuditResult, Page } from './types';
import { auditWebsite, checkBackendHealth } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auditingUrl, setAuditingUrl] = useState<string>('');
  const [backendAvailable, setBackendAvailable] = useState<boolean>(false);
  const [auditStartedAt, setAuditStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(available => {
      setBackendAvailable(available);
    });
  }, []);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);


  useEffect(() => {
    if (!auditStartedAt || appState !== AppState.LOADING) return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - auditStartedAt) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [auditStartedAt, appState]);

  const estimatedTime = useMemo(() => {
    const pages = result?.pages?.length || 8;
    return Math.max(30, pages * 12);
  }, [result?.pages?.length]);

  const handleAudit = useCallback(async (url: string) => {
    setAppState(AppState.LOADING);
    setCurrentPage(Page.HOME);
    setError(null);
    setAuditingUrl(url);
    setAuditStartedAt(Date.now());

    try {
      const data = await auditWebsite(url);
      setResult(data);
      setAppState(AppState.RESULTS);
      setAuditStartedAt(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while checking the site. Try again?");
      setAppState(AppState.ERROR);
      setAuditStartedAt(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
    setCurrentPage(Page.HOME);
    setAuditingUrl('');
    setAuditStartedAt(null);
    setElapsedSeconds(0);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.SERVICES: return <Services />;
      case Page.BLOGS: return <Blogs setPage={setCurrentPage} />;
      case Page.BLOG_POST: return <BlogPost setPage={setCurrentPage} />;
      case Page.AI_NEWS: return <AINews />;
      case Page.HOW_IT_WORKS: return <HowItWorks />;
      case Page.CONTACT: return <Contact />;
      case Page.PRICING: return <Pricing />;
      case Page.API_DOCS: return <ApiDocs setPage={setCurrentPage} />;
      case Page.HELP_CENTER: return <HelpCenter setPage={setCurrentPage} />;
      case Page.PRIVACY: return <PrivacyPolicy setPage={setCurrentPage} />;
      case Page.TERMS: return <TermsOfService setPage={setCurrentPage} />;
      case Page.COOKIES: return <CookiePolicy setPage={setCurrentPage} />;
      case Page.LOGIN: return <LoginPage />;
      case Page.HOME:
      default:
        if (appState === AppState.LOADING) {
          return (
            <div className="py-12">
              <Loader />
              <p className="text-center text-gray-500 mt-4">
                Analyzing: {auditingUrl}
              </p>
              <p className="text-center text-sm text-gray-400 mt-2">
                Elapsed: {elapsedSeconds}s • Estimated: ~{estimatedTime}s
              </p>
              {!backendAvailable && (
                <p className="text-center text-orange-500 text-sm mt-2">
                  ⚠️ Backend unavailable - showing demo results
                </p>
              )}
            </div>
          );
        }
        if (appState === AppState.RESULTS && result) {
          return <Results result={result} onReset={handleReset} />;
        }
        if (appState === AppState.ERROR) {
          return (
            <div className="text-center py-32 animate-fade-in">
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Audit Failed</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setCurrentPage(Page.LOGIN)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
                >
                  Test Login Page
                </button>
              </div>
            </div>
          );
        }
        return <Home onAudit={handleAudit} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setPage={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
