import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Resume Builder and Enhancer - Free Open Source Resume Builder',
  description: 'Free, open-source resume builder powered by AI. No watermarks, no hidden fees.',
  keywords: 'resume builder, cv maker, free resume, ATS-friendly resume, AI resume builder, professional templates',
  authors: [{ name: 'Mahesh Paul J' }],
  creator: 'AI Resume Builder and Enhancer',
  publisher: 'AI Resume Builder and Enhancer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://resumeitnow.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Resume Builder and Enhancer - Free Open Source Resume Builder',
    description: 'Free, open-source resume builder powered by AI. No watermarks, no hidden fees.',
    url: 'https://resumeitnow.vercel.app',
    siteName: 'AI Resume Builder and Enhancer',
    images: [
      {
        url: '/assets/ss.png',
        width: 1200,
        height: 630,
        alt: 'AI Resume Builder and Enhancer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Resume Builder and Enhancer - Free Open Source Resume Builder',
    description: 'Free, open-source resume builder powered by AI. No watermarks, no hidden fees.',
    images: ['/assets/ss.png'],
    creator: '@resumeitnow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ',
  },
  category: 'technology',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content="IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ" />
        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebApplication",
              "name": "AI Resume Builder and Enhancer",
              "description": "Free, open-source resume builder powered by AI. No watermarks, no hidden fees.",
              "url": "https://resumeitnow.vercel.app",
              "applicationCategory": "Resume Builder",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "AI Resume Builder and Enhancer"
              }
            })
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-white font-sans antialiased flex flex-col", inter.className)}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full py-4 text-center text-sm text-gray-600">
            <div className="mb-4">
              <p className="mb-2">A Product of the AdVentus Group. Designed by</p>
              <a 
                href="https://adventusgroup.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://i.imgur.com/WcoVQrI.png"
                  alt="AdVentus Logo"
                  width={120}
                  height={40}
                  className="mx-auto"
                  priority={false}
                />
              </a>
            </div>
            <div className="text-xs">
              <p>&copy; 2025 AI Resume Builder. All rights reserved.</p>
              <p>
                <a 
                  href="/LICENSE"
                  className="text-[#CB3F4A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MIT License
                </a>
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}