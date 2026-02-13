import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { AdSpace } from './AdSpace';

interface HomeProps {
  onAudit: (url: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onAudit }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    document.title = "WebAI Auditor - AI Powered Website Analysis";
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
      onAudit(url.trim());
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
          <span className="text-2xl">🤖</span>
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            AI-Powered Website Auditor
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          Check Your Website
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Like a Real User
          </span>
        </h1>

        <p className="text-xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
          AI actually opens your website in a browser, clicks buttons, navigates pages,
          and tells you exactly what's working and what's not. No chatbot — real browser testing.
        </p>

        {/* URL Input Form */}
        <div className="w-full max-w-2xl">
          <div className="bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
            Free • No signup • Results in 30 seconds
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

      {/* What AI Checks */}
      <div className="bg-white py-20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Does AI Check?
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Unlike GPT, this AI actually browses your website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🔴
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dead Buttons</h3>
              <p className="text-gray-600 leading-relaxed">
                Detects unclickable buttons and broken links across your site.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                😕
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Confusing UX</h3>
              <p className="text-gray-600 leading-relaxed">
                Finds unclear user flows and confusing navigation patterns.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Issues</h3>
              <p className="text-gray-600 leading-relaxed">
                Checks if your site breaks on phones and whether text is readable.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">UI Problems</h3>
              <p className="text-gray-600 leading-relaxed">
                Highlights cluttered layouts, poor contrast, and hidden elements to fix.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Slow Loading</h3>
              <p className="text-gray-600 leading-relaxed">
                Measures load speed and flags pages that may cause users to leave.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                ♿
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Checks missing alt text and potential screen-reader accessibility issues.
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
              { step: '1', icon: '🔗', title: 'Enter URL', desc: 'Enter your website URL and click the Audit button.' },
              { step: '2', icon: '🤖', title: 'AI Opens in Browser', desc: 'Our AI opens your site in a Playwright browser, just like a real user.' },
              { step: '3', icon: '🔍', title: 'Deep Analysis', desc: 'It clicks buttons, navigates pages, and captures screenshots.' },
              { step: '4', icon: '📊', title: 'Detailed Report', desc: 'You get a 5-point rating, an issue list, and actionable recommendations.' },
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
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Audit Your Website?
        </h2>
        <p className="text-xl text-gray-500 mb-8">
          Completely free. No signup required.
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
