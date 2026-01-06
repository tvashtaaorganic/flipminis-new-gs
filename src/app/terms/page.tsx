import Header from '@/components/Header';


export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Please read these Terms of Service carefully before using Flipminis.in.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using our service, you agree to be bound by these Terms.</p>

                    <h2>2. Use of Service</h2>
                    <p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>

                    <h2>3. Store Content</h2>
                    <p>You are responsible for the content you post on your store, including product details and images.</p>

                    <h2>4. Termination</h2>
                    <p>We may terminate or suspend your account if you violate these Terms.</p>
                </div>
            </main>

        </div>
    );
}
