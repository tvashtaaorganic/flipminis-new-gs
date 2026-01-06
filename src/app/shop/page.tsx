import { getCachedStores, getCachedProducts } from '@/lib/data';
import Link from 'next/link';
import Header from '@/components/Header';
import StoreCard from '@/components/StoreCard';
import ShopClient from './ShopClient';

export const revalidate = 300; // 5 minutes cache

export const metadata = {
    title: 'Create Your Online Store - Sell via WhatsApp | Flipminis Marketplace',
    description: 'Explore unique products and trusted stores powered by Flipminis. Build your complete online business in minutes with professional tools. Simplify ordering. Boost sales.',
};

export default async function ShopPage() {
    const stores = await getCachedStores();
    const allProducts = await getCachedProducts();

    // Pass only active data
    const activeStores = stores.filter(s => s.status === 'active');
    const activeProducts = allProducts.filter(p => p.active);

    return (
        <div className="min-h-screen">
            <Header />
            <ShopClient stores={activeStores} products={activeProducts} />
        </div>
    );
}
