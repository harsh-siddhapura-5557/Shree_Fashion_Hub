import type { Metadata } from 'next';
import Script from 'next/script';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ReturnPolicyBanner } from '@/components/ReturnPolicyBanner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shree Fashion Hub | Luxury Denim & Designer Jeans Studio',
  description: 'Discover handcrafted premium denim, Japanese selvedge, vintage 90s baggy cuts, and tapered stretch jeans at Shree Fashion Hub. Built with pure artisan standards.',
  keywords: [
    'Shree Fashion Hub',
    'Denim Jeans',
    'Men Jeans',
    'Japanese Selvedge',
    'Baggy Jeans',
    'Cargo Jeans',
    'Slim Fit Jeans',
    'Raw Denim India'
  ],
  openGraph: {
    title: 'Shree Fashion Hub - The Ultimate Denim Experience',
    description: 'Ultra-durable, premium wash jeans engineered for style, comfort, and longevity.',
    siteName: 'Shree Fashion Hub',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/icon.png?v=2', type: 'image/png' },
      { url: '/brand/sf-luxury-logo.png?v=2', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" href="/brand/sf-luxury-logo.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
        {/* Google Identity Services for direct real Google login */}
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        
        <AuthProvider>
          <CartProvider>
            {/* Top Return Policy Announcement Marquee */}
            <ReturnPolicyBanner />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
