import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';

export const Pricing: React.FC = () => {
  useEffect(() => {
    document.title = "Pricing - Webai Auditor";
  }, []);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Start for free, upgrade for the full developer toolkit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
            <span className="text-gray-500 ml-1">/forever</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Perfect for quick checks on personal projects.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Basic UI/UX Audit
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Limited Issues List (Top 3)
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Standard Support
            </li>
          </ul>

          <button className="w-full py-3 px-4 border border-black text-black rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Get Started Free
          </button>
        </div>

        {/* Premium Plan */}
        <div className="relative p-8 border border-blue-100 rounded-2xl bg-blue-50/30 shadow-xl shadow-blue-100/20">
          <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Popular
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">$3</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">For professional developers and agencies.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Unlimited Full Audits
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Deep Code Analysis
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Priority AI Processing
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              All Suggestions Unlocked
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-400 text-sm">Secure payment via Stripe. Cancel anytime.</p>
      </div>
      
      <AdSpace />
    </div>
  );
};