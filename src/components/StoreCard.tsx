import Link from 'next/link';
import { Store } from '@/types';

function VerifiedIcon() {
    return (
        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500 inline-block ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    );
}

export default function StoreCard({ store }: { store: Store }) {
    // Safe color generation or Initials
    const initials = store.store_name.slice(0, 2).toUpperCase();

    // Random gradient for avatar
    const gradients = [
        'from-pink-500 to-rose-500',
        'from-blue-500 to-indigo-500',
        'from-purple-500 to-violet-500',
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-amber-500',
    ];
    const gradient = gradients[store.store_name.length % gradients.length];

    // Derived trust signals
    const showVerified = store.verified;
    const location = store.city || store.state || 'Local Store';

    return (
        <Link href={`/${store.username}`} className="group block h-full">
            <div className="h-full bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col relative overflow-hidden">
                {/* Decorative top bar */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>

                {/* Mobile Layout - Avatar and Name in same row */}
                <div className="md:hidden mb-3">
                    <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center leading-tight break-words">
                                <span className="break-words">{store.store_name}</span>
                                {showVerified && <VerifiedIcon />}
                            </h3>
                        </div>
                        {store.is_open === false && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
                                Closed
                            </span>
                        )}
                    </div>

                    {/* Category Badge - Below (Mobile Only) */}
                    <div className="mb-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 rounded-full">
                            {store.category}
                        </span>
                    </div>

                    {/* Location + Response Time Pills - Mobile Only */}
                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] text-slate-600 dark:text-slate-400">
                            <span>📍</span>
                            <span>{location}</span>
                        </span>
                        {store.response_time && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] text-slate-600 dark:text-slate-400">
                                <span>⚡</span>
                                <span>{store.response_time}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Desktop Layout - Original */}
                <div className="hidden md:block">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0`}>
                            {initials}
                        </div>
                        {store.is_open === false ? (
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-900/30 rounded-full">
                                Closed
                            </span>
                        ) : (
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 rounded-full">
                                {store.category}
                            </span>
                        )}
                    </div>

                    <div className="mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 flex items-center leading-tight">
                            {store.store_name}
                            {showVerified && <VerifiedIcon />}
                        </h3>

                        {/* Location + Response Time - Desktop (inline text) */}
                        <div className="flex text-xs text-slate-500 dark:text-slate-400 items-center mt-1 space-x-2">
                            <span>📍 {location}</span>
                            {store.response_time && (
                                <>
                                    <span>•</span>
                                    <span>⚡ {store.response_time}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-4 md:mb-6 flex-grow line-clamp-2 leading-relaxed">
                    {store.address_full ? store.address_full : 'Visit our WhatsApp store to see our latest products and offers.'}
                </p>

                <div className="pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs md:text-sm font-medium">
                    <span className="text-blue-600 dark:text-blue-400 group-hover:underline decoration-2 underline-offset-2">Visit Store</span>
                    <span className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
            </div>
        </Link>
    );
}
