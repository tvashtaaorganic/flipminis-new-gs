import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://flipminis.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Flipminis - WhatsApp Chat Commerce Platform",
  description: "Build your online store in minutes. Receive orders directly on WhatsApp. No commissions, no hidden fees.",
  verification: {
    google: "rVFRJ_0Vin9xFWLAExbxVKyJOcg3z-vRKrlsjkxrK30",
  },
  openGraph: {
    title: "Flipminis",
    description: "Launch your WhatsApp Store in Seconds.",
    url: BASE_URL,
    siteName: "Flipminis",
    images: [
      {
        url: `${BASE_URL}/og-image.png`, // Fallback
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import Footer from '@/components/Footer';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z9C24CD98M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z9C24CD98M');
          `}
        </Script>

        {/* JSON-LD Schema */}
        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Flipminis",
              "url": "https://flipminis.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://flipminis.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </Script>

        {children}
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
        <Footer />
      </body>
    </html>
  );
}
