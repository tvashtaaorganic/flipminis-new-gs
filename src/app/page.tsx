import Header from '@/components/Header';
import StoreCard from '@/components/StoreCard';
import PricingSection from '@/components/PricingSection';
import SavingsCalculator from '@/components/SavingsCalculator';
import BusinessCategories from '@/components/BusinessCategories';
import StatsSection from '@/components/StatsSection';
import { getCachedStores, getCachedProducts } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 300; // 5 minutes cache

export default async function Home() {
  const stores = await getCachedStores();
  const allProducts = await getCachedProducts();

  const activeStores = stores.filter(s => s.status === 'active');
  const activeProducts = allProducts.filter(p => p.active);

  // Get unique categories from products
  const categories = Array.from(new Set(activeProducts.map(p => p.category)));

  // Count products per store
  const storeProductCounts = activeStores.map(store => ({
    ...store,
    productCount: allProducts.filter(p => p.store_id === store.store_id && p.active).length
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden pt-20 pb-16 md:pt-20 md:pb-20 px-4">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto relative z-10 text-center max-w-5xl">
            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 text-slate-900 dark:text-white leading-tight px-2">
              Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">WhatsApp Store</span> <br className="hidden md:block" /> in Seconds
            </h1>
            <p className="text-base md:text-2xl text-slate-600 dark:text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Zero commissions. No website builder needed. Just connect your WhatsApp and start selling instantly.
            </p>
            <div className="flex flex-row gap-3 justify-center items-center w-full max-w-md mx-auto sm:max-w-none px-4">
              <Link href="/onboard" className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-lg font-bold rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center whitespace-nowrap">
                Create Store
              </Link>
              <Link href="#featured" className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm sm:text-lg font-bold rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center whitespace-nowrap">
                Explore Stores
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />



        {/* Why Customers Love Chat Shopping */}
        <section className="w-full py-12 md:py-20 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 md:mb-4">Why Customers Love Chat Shopping</h2>
            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-8 md:mb-16 max-w-3xl mx-auto">
              Chat makes shopping personal, instant, and convenient for customers worldwide
            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">Instant Communication</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  Customers get immediate responses to questions, creating trust and faster purchases.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">Personal Experience</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  One-on-one conversations make customers feel valued and build lasting relationships.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">Mobile-First Shopping</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  Shop directly from their favorite messaging app - no new apps or accounts needed.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">Trusted Platform</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  Customers already trust chat for daily communication with family and friends.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">Local Language Support</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  Shop in their native language with voice messages, emojis, and local expressions.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3 md:mb-6">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 px-2">24/7 Availability</h3>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs px-2">
                  Browse products and place orders anytime, even when the business is closed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leading Chat Commerce Markets */}
        <section className="w-full py-20 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">Leading Chat commerce Markets Worldwide</h2>
              <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400">Join millions of businesses already using chat for commerce</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {/* India */}
              <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇮🇳</span>
                    <span className="hidden md:inline">India</span>
                    <span className="md:hidden">IN</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Hindi</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+25%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">853M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹160T</span>
                  </div>
                </div>
              </div>

              {/* Brazil */}
              <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇧🇷</span>
                    <span className="hidden md:inline">Brazil</span>
                    <span className="md:hidden">BR</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Portuguese</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+20%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">148M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹125T</span>
                  </div>
                </div>
              </div>

              {/* Indonesia */}
              <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇮🇩</span>
                    <span className="hidden md:inline">Indonesia</span>
                    <span className="md:hidden">ID</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Bahasa</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+30%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">112M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹72T</span>
                  </div>
                </div>
              </div>

              {/* Mexico */}
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇲🇽</span>
                    <span className="hidden md:inline">Mexico</span>
                    <span className="md:hidden">MX</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Spanish</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+18%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">85M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹55T</span>
                  </div>
                </div>
              </div>

              {/* Nigeria */}
              <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇳🇬</span>
                    <span className="hidden md:inline">Nigeria</span>
                    <span className="md:hidden">NG</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">English</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+35%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">90M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹38T</span>
                  </div>
                </div>
              </div>

              {/* Argentina */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇦🇷</span>
                    <span className="hidden md:inline">Argentina</span>
                    <span className="md:hidden">AR</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Spanish</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+22%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">35M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹24T</span>
                  </div>
                </div>
              </div>

              {/* Turkey */}
              <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇹🇷</span>
                    <span className="hidden md:inline">Turkey</span>
                    <span className="md:hidden">TR</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">Turkish</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+28%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">44M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹27T</span>
                  </div>
                </div>
              </div>

              {/* South Africa */}
              <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-2xl">🇿🇦</span>
                    <span className="hidden md:inline">South Africa</span>
                    <span className="md:hidden">ZA</span>
                    <span className="text-xs md:text-xs text-slate-400 font-normal hidden md:inline">English</span>
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">+24%</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Users:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">22M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Market:</span>
                    <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">₹15T</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>



        {/* Business Categories / Use Cases */}
        <BusinessCategories />

        {/* Pricing Section */}
        <PricingSection />

        {/* Savings Calculator Section */}
        <SavingsCalculator />

      </main>


    </div>
  );
}
