'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/pricing', label: 'Pricing' },
    { href: '#', label: 'About' },
    { href: '#', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
              Tongues Trend
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-dark hover:text-gold transition-colors duration-150 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <button
              className="px-6 py-2.5 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              Book Free Consultation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-light transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-dark hover:text-gold transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <button
                className="w-full mt-4 px-4 py-2.5 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-all duration-150"
                style={{ fontFamily: 'Poppins' }}
              >
                Book Free Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
