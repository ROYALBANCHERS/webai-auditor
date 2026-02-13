import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { AdSpace } from './AdSpace';

interface HomeProps {
  onAudit: (url: string, credentials?: { username: string; password: string }, language?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onAudit }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'zh' | 'ja' | 'es' | 'fr' | 'de' | 'ar' | 'ru'>('en');

  // Language labels helper
  const getLanguageLabel = (lang: string) => {
    const labels = {
      en: { flag: '🇺🇸', name: 'English', code: 'EN' },
      hi: { flag: '🇮🇳', name: 'हिंदी', code: 'HI' },
      zh: { flag: '🇨🇳', name: '中文', code: 'ZH' },
      ja: { flag: '🇯🇵', name: '日本語', code: 'JA' },
      es: { flag: '🇪🇸', name: 'Español', code: 'ES' },
      fr: { flag: '🇫🇷', name: 'Français', code: 'FR' },
      de: { flag: '🇩🇪', name: 'Deutsch', code: 'DE' },
      ar: { flag: '🇸🇦', name: 'العربية', code: 'AR' },
      ru: { flag: '🇷🇺', name: 'Русский', code: 'RU' }
    };
    return labels[lang] || labels.en;
  };

  const handleLanguageChange = (lang: any) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAudit(url.trim(), username && password ? { username, password } : undefined, language);
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
      {/* Language Selector Dropdown */}
      <div className="fixed top-4 left-4 z-50">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as any)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-md text-sm font-medium appearance-none cursor-pointer hover:bg-gray-50 pr-8"
        >
          <option value="en">🇺🇸 English</option>
          <option value="hi">🇮🇳 हिंदी (Hindi)</option>
          <option value="zh">🇨🇳 中文 (Chinese)</option>
          <option value="ja">🇯🇵 日本語 (Japanese)</option>
          <option value="es">🇪🇸 Español (Spanish)</option>
          <option value="fr">🇫🇷 Français (French)</option>
          <option value="de">🇩🇪 Deutsch (German)</option>
          <option value="ar">🇸🇦 العربية (Arabic)</option>
          <option value="ru">🇷🇺 Русский (Russian)</option>
        </select>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-2xl">🔍</span>
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            {language === 'hi' ? 'व्यापक वेबसाइट ऑडिटर' : 'Comprehensive Tech Stack Auditor'}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          {language === 'hi' ? 'किसी भी वेबसाइट का विश्लेषण करें' : 'Analyze Any Website'}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {language === 'hi' ? 'कोई भी टेक स्टैक' : 'Any Tech Stack'}
          </span>
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
          {language === 'hi' ? 'किसी भी टेक्नोलॉजी, लाइब्रेरी, या AI-जनरेटेड वेबसाइट की जांच करें।' : 'Comprehensive technical analysis for ANY tech stack.'}
        </p>

        {/* URL Input Form */}
        <div className="w-full max-w-2xl">
          <div className="bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9 9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m9 9a9 9 0 019-9" />
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
            Free • No signup • Real-browser checks with page-by-page reporting
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Optional login username/email" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Optional login password" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
          </div>
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

        {/* What We Check */}
        <div className="bg-white py-20 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Tech Stack Analysis
              </h2>
            </div>

            {/* Rest of the cards section... */}
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

            {/* Step cards... */}
          </div>
        </div>

        {/* Ad Section */}
        <div className="max-w-4xl mx-auto px-4">
          <AdSpace />
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

        {/* Footer */}
        <Footer />
      </div>
    );
};
