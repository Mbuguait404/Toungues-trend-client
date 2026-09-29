import Link from 'next/link'
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-navy text-white">
      {/* Main Footer Content */}
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" amount={0.05}>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12" stagger={0.1} amount={0.05}>
          {/* Column 1: Logo & Tagline */}
          <StaggerItem>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Tongues Trend Logo"
                width={160}
                height={44}
                style={{ width: 'auto', height: '44px' }}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium 1-on-1 language tutoring connecting you with certified teachers worldwide.
            </p>
          </StaggerItem>

          {/* Column 2: Languages */}
          <StaggerItem>
            <h4 className="font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              Languages
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/courses?language=french" className="hover:text-gold transition-colors">
                  French
                </Link>
              </li>
              <li>
                <Link href="/courses?language=english" className="hover:text-gold transition-colors">
                  English
                </Link>
              </li>
              <li>
                <Link href="/courses?language=german" className="hover:text-gold transition-colors">
                  German
                </Link>
              </li>
              <li>
                <Link href="/courses?language=kiswahili" className="hover:text-gold transition-colors">
                  Kiswahili
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Column 3: Company */}
          <StaggerItem>
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
                <Link href="/about" className="hover:text-gold transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Column 4: Contact */}
          <StaggerItem>
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
          </StaggerItem>
        </Stagger>

        {/* Divider */}
        <Reveal className="border-t border-gray-700 pt-8 sm:pt-12" delay={0.15} amount={0.05}>
          {/* Social Icons */}
          <div className="flex justify-start gap-3 mb-6">
            <a
              href="https://www.instagram.com/tonguestrend?igsh=MXduYnowOWVmb3Fvaw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.tiktok.com/@tonguestrend?_r=1&_t=ZN-97q3LvhJ6YB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
              aria-label="TikTok"
            >
              <FaTiktok size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com/share/1YL4CrXfLv/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <FaFacebookF size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.twitter.com/tonguestrend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
              aria-label="X"
            >
              <FaXTwitter size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/tongue-strend-013789420?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={19} aria-hidden="true" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © {currentYear} Tongues Trend. All rights reserved. | www.tonguestrend.com
          </p>
        </Reveal>
      </Reveal>
    </footer>
  )
}
