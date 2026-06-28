import Link from 'next/link'
import { Share2, Music, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-navy text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins' }}>
              Tongues Trend
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium 1-on-1 language tutoring connecting you with certified teachers worldwide.
            </p>
          </div>

          {/* Column 2: Languages */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              Languages
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  French
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  English
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  German
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Kiswahili
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-gold transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:info@tonguestrend.com" className="hover:text-gold transition-colors">
                  info@tonguestrend.com
                </a>
              </li>
              <li>
                <a href="tel:+41779766835" className="hover:text-gold transition-colors">
                  +41 779 766835
                </a>
              </li>
              <li>
                <a href="tel:+254729482786" className="hover:text-gold transition-colors">
                  +254 729 482 786
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 sm:pt-12">
          {/* Social Icons */}
          <div className="flex justify-start gap-4 mb-6">
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Instagram"
            >
              <Share2 size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="TikTok"
            >
              <Music size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Facebook"
            >
              <Heart size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © {currentYear} Tongues Trend. All rights reserved. | www.tonguestrend.com
          </p>
        </div>
      </div>
    </footer>
  )
}
