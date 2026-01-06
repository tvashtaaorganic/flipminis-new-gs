'use client';

export default function StatsSection() {
    return (
        <section className="w-full py-20 px-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        If you can think it,<br />
                        you can sell it with <span className="text-blue-600 dark:text-blue-400">Flipminis</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
                    {/* Stat 1 */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-4">1 Million+</h3>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mb-3">customers served monthly</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic max-w-xs">
                            That means our tech can scale from 1 to 1 million customers in a second
                        </p>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-4">₹2 Crore+</h3>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mb-3">saved in commissions</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic max-w-xs">
                            That's ₹2 Crore+ invested back into growing the businesses
                        </p>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-4">2X</h3>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            conversions on choosing Flipminis vs others
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic max-w-xs">
                            That's a 50% reduction in your lost DMs
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
