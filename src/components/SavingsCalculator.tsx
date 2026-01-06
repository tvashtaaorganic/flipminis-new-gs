'use client';

import { useState } from 'react';

export default function SavingsCalculator() {
    const [monthlyOrders, setMonthlyOrders] = useState(100);
    const [avgOrderValue, setAvgOrderValue] = useState(2500);

    const monthlySales = monthlyOrders * avgOrderValue;
    const commissionRate = 0.03; // Assuming 3% average commission for "other platforms"
    const otherPlatformEarnings = monthlySales * (1 - commissionRate);
    const ourEarnings = monthlySales;
    const savings = monthlySales - otherPlatformEarnings;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <section className="w-full py-20 px-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                        You deserve 100% of your <br className="hidden md:block" />
                        hard earned money.
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Most platforms silently take <span className="text-red-500 font-bold">2–5%</span> from every order.
                        See how much you can save with our <span className="text-green-500 font-bold">0% commissions</span> policy.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-10">

                    {/* Sliders */}
                    <div className="space-y-8 mb-12">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-slate-600 dark:text-slate-300 font-medium text-lg">Monthly orders</label>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{monthlyOrders}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="1000"
                                step="10"
                                value={monthlyOrders}
                                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-slate-600 dark:text-slate-300 font-medium text-lg">Average order value</label>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(avgOrderValue)}</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="10000"
                                step="100"
                                value={avgOrderValue}
                                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly sales</span>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(monthlySales)}</span>
                        </div>

                        {/* Other Platforms */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/30 gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-red-700 dark:text-red-300 font-medium">With other platforms</span>
                                <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 text-xs font-bold px-2 py-1 rounded">-3%</span>
                            </div>
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(otherPlatformEarnings)}</span>
                        </div>

                        {/* Platform Comparison */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30 gap-4 transform scale-105 shadow-md">
                            <div className="flex items-center gap-3">
                                <span className="text-green-700 dark:text-green-300 font-bold">With Flipminis</span>
                                <span className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-bold px-2 py-1 rounded">100%</span>
                            </div>
                            <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">{formatCurrency(ourEarnings)}</span>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                You save <span className="text-green-600 dark:text-green-400 font-extrabold text-xl">{formatCurrency(savings)}</span> every month by using Flipminis
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
