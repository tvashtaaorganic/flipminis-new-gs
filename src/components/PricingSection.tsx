'use client';

import Link from 'next/link';

export default function PricingSection() {
  const features = [
    '0% Commission',
    'Unlimited Products',
    'Unlimited Orders',
    'Receive Orders in WhatsApp',
    'Manage Order Status',
    'Multiple Shipping Methods',
  ];

  return (
    <section id="pricing" className="w-full py-20 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">Choose the plan that fits your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Card 1: Monthly */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-2 duration-300">
            <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Monthly</h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">₹200</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/onboard"
              className="block w-full py-4 text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-xl transition-all duration-300"
            >
              Start Monthly Plan
            </Link>
          </div>

          {/* Card 2: Yearly */}
          <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-blue-500 flex flex-col relative overflow-hidden hover:-translate-y-2 duration-300 transform md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Best Value
            </div>

            <h3 className="text-xl font-bold text-blue-100 mb-2 uppercase tracking-wide">Yearly</h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">₹1200</span>
              <span className="text-blue-100 font-medium">/year</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-blue-50">
                  <div className="bg-blue-500/50 rounded-full p-1 shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-blue-50">
                <div className="bg-blue-500/50 rounded-full p-1 shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">Save ₹400 per year</span>
              </li>
            </ul>

            <Link
              href="/onboard"
              className="block w-full py-4 text-center bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl transition-all shadow-lg"
            >
              Start Yearly Plan
            </Link>

            <div className="mt-4 text-center">
              <p className="text-xs text-blue-200 font-medium">Limited time offer: Ends this month!</p>
            </div>
          </div>

          {/* Card 3: Coming Soon (Special Edition) */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 shadow-sm border border-dashed border-slate-300 dark:border-slate-700 flex flex-col relative opacity-90 hover:opacity-100 transition-all hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/100 group">
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transform -rotate-6">Coming Soon</span>
            </div>

            <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Pro Edition</h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-400 dark:text-slate-600">₹2500</span>
              <span className="text-slate-400 dark:text-slate-500 font-medium">/year</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1 opacity-60">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium"> 0% Commission </span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium"> 250 products </span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">250 monthly orders</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Receive Orders in WhatsApp </span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Discount coupons</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Manage Order Status </span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Multiple Shipping methods</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Payment methods (Paypal, Stripe, etc..)</span>
              </li>
            </ul>

            <button
              disabled
              className="block w-full py-4 text-center bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
