import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Poppins } from 'next/font/google'
import './globals.css'
import FloatingSocialIcons from '@/components/floating-social-icons'
import { MotionProvider } from '@/components/motion'
import { AuthProvider } from '@/context/AuthContext'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tongues Trend | Master a New Language with Expert Online Tutors',
  description: 'Live 1-on-1 language lessons in French, English, German & Kiswahili from certified teachers worldwide. CEFR aligned, flexible scheduling, digital certificates.',
  generator: 'v0.app',
  icons: {
    icon: '/Favicon.ico',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#1a1a2e' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-white`}>
      <body className="font-sans antialiased bg-white text-gray-dark" suppressHydrationWarning>
        <MotionProvider>
          <AuthProvider>
            {children}
            <FloatingSocialIcons />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
