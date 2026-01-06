import { getSession } from '@/lib/auth';
import { getProducts, getStores, getPayments } from '@/lib/googleSheets';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const products = await getProducts(session.storeId);
    const stores = await getStores();
    const payments = await getPayments(session.storeId);

    const store = stores.find(s => s.store_id === session.storeId);

    if (!store) {
        return <div>Error loading store data. Please contact support.</div>;
    }

    // Enrich store with latest subscription info
    if (payments.length > 0) {
        // Sort by end_date desc
        const latestPayment = payments.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0];
        store.subscription_start = latestPayment.start_date;
        store.subscription_end = latestPayment.end_date;
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <DashboardClient
                initialProducts={products}
                store={store}
            />
        </div>
    );
}
