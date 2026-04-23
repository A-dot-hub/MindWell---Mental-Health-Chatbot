import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import '../src/styles/index.css'
import '../src/styles/App.css'
import '../src/styles/UserMenu.css'
import '../src/styles/Chat.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MindWell AI',
  icons: {
    icon: [
      {
        url: '/mediverseLogo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/mediverseLogo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'mediverseLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/mediverseLogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
