'use client';

import { useRef } from 'react';

const businessTypes = [
    {
        icon: '🥘',
        title: 'Home Food Delivery',
        description: 'Cloud kitchen & tiffin services',
        color: 'bg-orange-100 text-orange-600',
    },
    {
        icon: '💎',
        title: 'Handmade Jewelry',
        description: 'Custom jewelry & accessories',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: '🎂',
        title: 'Home Bakery',
        description: 'Cakes, cookies & desserts',
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        icon: '👗',
        title: 'Boutique & Sarees',
        description: 'Ethnic wear & fashion',
        color: 'bg-pink-100 text-pink-600',
    },
    {
        icon: '🌿',
        title: 'Organic Products',
        description: 'Health & wellness products',
        color: 'bg-green-100 text-green-600',
    },
    {
        icon: '👶',
        title: 'Kids Clothing & Toys',
        description: 'Children\'s products',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: '💇‍♀️',
        title: 'Home Salon Services',
        description: 'Booking via chat, offers, loyalty',
        color: 'bg-rose-100 text-rose-600',
    },
    {
        icon: '🎁',
        title: 'Customized Gifts',
        description: 'Personalized products shared via chat',
        color: 'bg-indigo-100 text-indigo-600',
    },
    {
        icon: '💍',
        title: 'Imitation Jewellery',
        description: 'Trending in Tier 2/3 cities',
        color: 'bg-amber-100 text-amber-600',
    },
    {
        icon: '🎨',
        title: 'Art & Craft',
        description: 'Showcase via images, easy chat support',
        color: 'bg-teal-100 text-teal-600',
    },
    {
        icon: '💄',
        title: 'Freelance Makeup Artist',
        description: 'Book appointments, share portfolio',
        color: 'bg-red-100 text-red-600',
    },
    {
        icon: '🥒',
        title: 'Pickles & Snacks',
        description: 'High trust product, repeat orders',
        color: 'bg-lime-100 text-lime-600',
    },
    {
        icon: '📚',
        title: 'Tuition / Coaching',
        description: 'Class schedules, payment tracking',
        color: 'bg-cyan-100 text-cyan-600',
    },
    {
        icon: '📱',
        title: 'Digital Products',
        description: 'Sell ebooks, templates via chat',
        color: 'bg-violet-100 text-violet-600',
    },
    {
        icon: '🔮',
        title: 'Astrology / Tarot',
        description: '1:1 sessions on chat, paid consultations',
        color: 'bg-fuchsia-100 text-fuchsia-600',
    },
];

export default function BusinessCategories() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Perfect for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Every Business</span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Join thousands of businesses already growing on our platform
                    </p>
                </div>

                <div className="relative group">
                    {/* Scroll Buttons (Desktop & Mobile) */}
                    <button
                        onClick={scrollLeft}
                        className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all opacity-100 border border-slate-200 dark:border-slate-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={scrollRight}
                        className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all opacity-100 border border-slate-200 dark:border-slate-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Scrolling Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar"
                        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    >
                        {businessTypes.map((biz, index) => (
                            <div
                                key={index}
                                className="flex-none w-64 md:w-72 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-1 snap-start"
                            >
                                <div className={`w-14 h-14 rounded-xl ${biz.color} flex items-center justify-center text-2xl mb-4`}>
                                    {biz.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{biz.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    {biz.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Swipe Hint */}
                    <div className="md:hidden flex justify-center gap-1 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
