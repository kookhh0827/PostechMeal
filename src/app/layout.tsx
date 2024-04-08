import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import * as React from 'react';
import { FaGithub } from 'react-icons/fa';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { siteConfig } from '@/constant/config';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.png`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.png`],
    // creator: '@th_clarence',
  },
  authors: [
    {
      name: 'Hyunho Kook',
      url: 'https://github.com/kookhh0827',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <script
        defer
        src='https://analytics.us.umami.is/script.js'
        data-website-id='222be23d-da3d-4425-8435-f30ffbe7b162'
      ></script>
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics gaId='GTM-TJG49FZS'></GoogleAnalytics>
      <body>{children}</body>
      <footer className='mt-auto bg-gray-800 text-white py-4 text-sm px-1.5'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center'>
            <a
              href='https://github.com/kookhh0827/PostechMeal'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2'
            >
              <FaGithub className='text-2xl' />
              <span>Github Repo</span>
            </a>
          </div>
          <div>
            <p>문의: kookhh0827@postech.ac.kr</p>
          </div>
        </div>
      </footer>
    </html>
  );
}
