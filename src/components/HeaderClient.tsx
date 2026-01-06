'use client';

import Link from 'next/link';

export default function HeaderClient({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 group">
                    <img src="https://lh3.googleusercontent.com/pw/AP1GczPbj9Cu_GjIa7KrcBVxzOuBheZJWNIQ0M3qp-sfhNqHSsZ5Eym6HuS7Xmm_KRmWRhcux5xQAK2ZAcH0gmjRlRTHSSNcx2JpCLilcqyeXIRp1uFGpSP7lMK9x75E6LEbcSzpR4x_qvoY-zFiTHgf5ze4=w1531-h400-s-no-gm?authuser=0" alt="Flipminis" className="h-10 w-auto" />
                </Link>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
                        Shop
                    </Link>
                    <Link href="/#pricing" className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors scroll-smooth">
                        Pricing
                    </Link>
                </nav>

                {/* Mobile Shop Link (Visible on small screens) */}
                <Link href="/shop" className="md:hidden text-sm font-bold text-slate-700 dark:text-slate-200 mr-2 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Shop
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
                                Dashboard
                            </Link>
                            <form action="/api/logout" method="POST">
                                <button type="submit" className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors px-2">
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors px-2">
                                Login
                            </Link>
                            <Link href="/onboard" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                Create Store
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
