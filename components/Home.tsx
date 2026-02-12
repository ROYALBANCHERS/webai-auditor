import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { AdSpace } from './AdSpace';

interface HomeProps {
  onAudit: (url: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onAudit }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    document.title = "Webai Auditor - AI Powered Web Analysis";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAudit(url);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <span className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium uppercase tracking-wider mb-6">
          AI-Powered Website Analysis
        </span>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6 max-w-4xl">
          Check your website health with <br className="hidden md:block" />
          <span className="font-semibold text-black">Webai Auditor Logic</span>
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
          Get a detailed audit of your UI, UX, and Code quality. Our AI identifies broken buttons, missing scripts, and gives you expert advice in simple language.
        </p>

        <div className="w-full max-w-lg">
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/50">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter website URL (e.g., myshop.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg font-light w-full"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white rounded-xl font-medium text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-black/10 sm:w-auto w-full whitespace-nowrap"
              >
                Start Audit
              </button>
            </form>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Try it now. It's free and fast.
          </p>
        </div>
      </div>

      {/* Ad Section */}
      <div className="max-w-4xl mx-auto px-4">
        <AdSpace />
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Code Analysis</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                We detect missing meta tags, deprecated HTML, and broken script references that slow down your site.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.118 6.79L7.53 9.115m-4.876 4.876l2.897.777M2.239 16.812l2.897-.777m4.876 4.876l-2.415-2.415" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">UX & Buttons</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Identify buttons that don't work, layout shifts, and mobile responsiveness issues before your users do.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Advice</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Simple, actionable advice in plain language. No complex jargon, just straight facts to fix your site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};