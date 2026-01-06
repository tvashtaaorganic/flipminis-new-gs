import Header from '@/components/Header';


export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>This Refund Policy explains how cancellations and refunds are handled on Flipminis.in.</p>

                    <h2>1. Subscription Refunds</h2>
                    <p>We do not offer refunds for subscription payments once processed.</p>

                    <h2>2. Cancellations</h2>
                    <p>You may cancel your subscription at any time, but no refund will be provided for the remaining period.</p>

                    <h2>3. Store Transactions</h2>
                    <p>Flipminis.in is not involved in transactions between sellers and buyers. Refunds for products purchased from stores are subject to the individual seller's policy.</p>
                </div>
            </main>

        </div>
    );
}
