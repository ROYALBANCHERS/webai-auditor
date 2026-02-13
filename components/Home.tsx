import React, { useState, useEffect } from 'react';
import { AdSpace } from './AdSpace';

interface HomeProps {
  onAudit: (url: string, credentials?: { username?: string; password?: string }) => void;
}

export const Home: React.FC<HomeProps> = ({ onAudit }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = "WebAI Auditor - Comprehensive Tech Stack Analysis";
  }, []);

  // Basic URL validation
  useEffect(() => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValidDomain = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    setIsValid(url.length > 3 && (urlPattern.test(url) || isValidDomain.test(url)));
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAudit(url.trim(), { username: username.trim(), password: password.trim() });
    }
  };

  const exampleSites = [
    'amazon.com',
    'stripe.com',
    'notion.so',
    'apple.com',
    'shopify.com',
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-2xl">🔍</span>
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Comprehensive Tech Stack Auditor
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          Analyze Any Website
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Any Tech Stack
          </span>
        </h1>

        <p className="text-xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
          Comprehensive technical analysis for websites built with ANY tech stack. Works with
          React, Vue, Angular, Next.js, WordPress, Shopify, AI-generated sites (v0, Claude, Cursor), and more.
        </p>

        {/* URL Input Form */}
        <div className="w-full max-w-2xl">
          <div className="bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9 9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <input
                  type="text"
                  placeholder="example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg w-full"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 px-1">
                <input
                  type="text"
                  placeholder="Optional login email/username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  placeholder="Optional login password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!isValid}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 whitespace-nowrap ${
                  isValid
                    ? 'bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Audit Website
              </button>
            </form>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Optional credentials let us validate login-protected pages
          </p>
        </div>

        {/* Example Sites */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-3">Try with an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleSites.map((site) => (
              <button
                key={site}
                onClick={() => setUrl(site)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
              >
                {site}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ad Section */}
      <div className="max-w-4xl mx-auto px-4">
        <AdSpace />
      </div>

      {/* What We Check */}
      <div className="bg-white py-20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Tech Stack Analysis
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Works with ANY framework, library, or AI-generated website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - SEO */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">SEO Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Meta tags, headings structure, Open Graph, structured data, sitemap
              </p>
            </div>

            {/* Card 2 - Security */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Security Check</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                HTTPS, mixed content, exposed API keys, insecure forms
              </p>
            </div>

            {/* Card 3 - Performance */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Load times, DOM complexity, image optimization, lazy loading
              </p>
            </div>

            {/* Card 4 - Accessibility */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                ♿
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Alt text, ARIA labels, keyboard nav, color contrast, semantic HTML
              </p>
            </div>

            {/* Card 5 - Mobile */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📱
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile Ready</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Viewport settings, touch targets, responsive images, mobile menu
              </p>
            </div>

            {/* Card 6 - UX */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                👥
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">UX Review</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Navigation, CTAs, forms, dead links, user flow
              </p>
            </div>

            {/* Card 7 - UI */}
            <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎨
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">UI Design</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Typography consistency, spacing, visual hierarchy, broken images
              </p>
            </div>

            {/* Card 8 - Tech Stack */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🧱
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tech Stack</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Frameworks, libraries, CMS, analytics, hosting detection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '1', icon: '🔗', title: 'Enter Your URL', desc: 'Simply enter your website URL and click the Audit button. Works with any website.' },
              { step: '2', icon: '🤖', title: 'Browser Opens Your Site', desc: 'Our automated browser opens your site using Playwright — just like a real user.' },
              { step: '3', icon: '🔍', title: 'Comprehensive Analysis', desc: 'Analyzes SEO, Security, Performance, Accessibility, Mobile, UX, UI, and Functionality.' },
              { step: '4', icon: '🧱', title: 'Tech Stack Detection', desc: 'Detects all frameworks, libraries, CMS, and tools — works with any tech stack.' },
              { step: '5', icon: '📊', title: 'Detailed Report', desc: 'Get a rating (out of 5), categorized issues, and actionable recommendations.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Audit Any Website?
        </h2>
        <p className="text-xl text-gray-500 mb-8">
          Works with any tech stack — React, Vue, Angular, WordPress, Shopify, AI-generated sites, and more.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105"
        >
          Start Free Audit
        </button>
      </div>
    </div>
  );
};
