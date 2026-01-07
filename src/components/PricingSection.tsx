'use client';

import Link from 'next/link';

export default function PricingSection() {
  const features = [
    '0% Commission - Keep 100% of your profits',
    'Unlimited Products - Sell as much as you want',
    'Unlimited Orders - No hidden limits',
    'Direct WhatsApp Orders - No checkout pages needed',
    'Cancel Anytime - No long-term commitment',
    'Just 1 order/month covers the cost',
  ];

  return (
    <section id="pricing" className="w-full py-20 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Your Own Store for Just ₹100/month</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">No commission. No checkout. Just WhatsApp.</p>
          <p className="text-sm text-slate-600 dark:text-slate-500">Most sellers choose yearly and save 50%</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

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
            <div className="mb-2">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-bold text-blue-200 line-through opacity-60">₹2400</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full">50% OFF</span>
              </div>
              <span className="text-5xl font-extrabold text-white">₹1200</span>
              <span className="text-blue-100 font-medium">/year</span>
            </div>
            <div className="mb-6 bg-blue-500/30 rounded-lg px-4 py-2 border border-blue-400/50">
              <p className="text-sm text-white font-bold">Just ₹100/month when billed yearly</p>
              <p className="text-xs text-blue-100 mt-1">Save ₹1200 compared to monthly billing</p>
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
                <div className="bg-yellow-400 rounded-full p-1 shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">Most sellers choose this plan</span>
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

        </div>

        {/* Psychological Value Propositions */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">Why Sellers Love Flipminis</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">₹3.33/day</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Less than a cup of chai</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">1 Sale</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pays for the entire month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">0%</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Commission on every order</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Unlimited Products</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sell as much as you want</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Unlimited WhatsApp Orders</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No hidden limits ever</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Zero Commission (0%)</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Keep 100% of your profits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">No Transaction Fees</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">All payments go directly to you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Cancel Anytime</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No long-term commitment required</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Direct Customer Chat</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Build relationships on WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Your own online store for just ₹100/month
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Join thousands of sellers who trust Flipminis
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
