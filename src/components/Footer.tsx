import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-8 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 text-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Flipminis.in. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Terms of Service
                        </Link>
                        <Link href="/refund-policy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
