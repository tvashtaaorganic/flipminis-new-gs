'use client';

import Link from 'next/link';
import React, { useState } from 'react';

interface Props {
    activeView: string;
    setActiveView: (view: string) => void;
    storeName: string;
    username: string;
}

export default function DashboardSidebar({ activeView, setActiveView, storeName, username }: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: '🏠' },
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'add_product', label: 'Add Product', icon: '➕' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Header (Fixed Top) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={toggleMenu} className="text-2xl p-2 text-slate-700 active:bg-slate-100 rounded-lg">
                        ☰
                    </button>
                    <span className="font-bold text-lg text-slate-800 truncate max-w-[200px]">{storeName}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-100">
                    {storeName.slice(0, 2).toUpperCase()}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-72 bg-white border-r border-slate-100 flex flex-col h-full
                transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Desktop Header */}
                <div className="p-8 border-b border-slate-50 hidden md:block">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ring-4 ring-blue-50">
                            {storeName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-slate-800 leading-tight truncate">{storeName}</h2>
                            <p className="text-xs text-slate-400 font-medium truncate">@{username}</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Header (inside drawer) */}
                <div className="md:hidden p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-slate-800 text-lg">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 bg-white rounded-lg border border-slate-200">✕</button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === item.id
                                    ? 'bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                            {activeView === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </button>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-50 space-y-2 bg-slate-50/50">
                    <a
                        href={`/${username}`}
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all font-bold text-sm border border-transparent hover:border-slate-100 hover:shadow-sm"
                    >
                        <span>↗️</span> View Store
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Spacer for Mobile Header Content Push */}
            <div className="h-16 md:hidden w-full flex-shrink-0"></div>
        </>
    );
}
