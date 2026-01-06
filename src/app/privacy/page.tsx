import Header from '@/components/Header';


export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>At Flipminis.in, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information that you provide directly to us when you create a store, such as your store name, email address, WhatsApp number, and password.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to provide and improve our services, communicate with you, and ensure the security of our platform.</p>

                    <h2>3. Data Security</h2>
                    <p>We implement security measures to protect your personal information.</p>

                    <h2>4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us.</p>
                </div>
            </main>

        </div>
    );
}
