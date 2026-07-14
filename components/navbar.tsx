'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronRight, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { roleToPath } from '@/lib/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  // Handle scroll effect for dynamic styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/tutors', label: 'Tutors' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex justify-between items-center transition-all duration-300 ease-out rounded-2xl ${
            scrolled 
              ? 'h-16 bg-white/70 backdrop-blur-lg border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6' 
              : 'h-20 bg-transparent px-2'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-10">
            <div className="relative overflow-hidden rounded-lg">
              <Image 
                src="/logo.png" 
                alt="Tongues Trend Logo" 
                width={120} 
                height={36} 
                className={`object-contain transition-all duration-300 origin-left ${
                  scrolled ? 'scale-75 group-hover:scale-90' : 'scale-100 group-hover:scale-105'
                }`} 
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  scrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out rounded-full" />
                <span className="absolute inset-0 bg-gray-50/50 rounded-lg transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 -z-10" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={roleToPath(user.role)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className={`text-sm font-semibold transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={`text-sm font-semibold transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Register Now
                </Link>
              </>
            )}
            <Link
              href="/courses"
              className="group relative px-6 py-2.5 rounded-full font-semibold text-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center"
              style={{ fontFamily: 'Poppins' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-[#FDC76F] transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent transition-opacity duration-300" />
              <span className="relative flex items-center gap-2 text-primary">
                Enrol Now
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors relative z-10 ${
              scrolled ? 'hover:bg-gray-100/80 text-gray-800' : 'hover:bg-white/20 text-white'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                <Menu size={24} />
              </span>
              <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                <X size={24} />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 px-4 pt-2 transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100/50 shadow-xl rounded-2xl p-4 flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80 rounded-xl transition-all"
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${isOpen ? i * 50 : 0}ms` }}
            >
              {link.label}
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={roleToPath(user.role)}
                  className="w-full flex items-center justify-center gap-2 relative px-4 py-3 rounded-xl font-semibold text-sm text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full relative px-4 py-3 rounded-xl font-semibold text-sm text-center border border-secondary text-secondary hover:bg-secondary/10 transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full relative px-4 py-3 rounded-xl font-semibold text-sm text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="w-full relative px-4 py-3 rounded-xl font-semibold text-sm text-center border border-secondary text-secondary hover:bg-secondary/10 transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Register Now
                </Link>
              </>
            )}
            <Link
              href="/courses"
              className="w-full relative px-4 py-3 rounded-xl font-semibold text-sm overflow-hidden flex items-center justify-center gap-2 group"
              style={{ fontFamily: 'Poppins' }}
              onClick={() => setIsOpen(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-[#FDC76F]" />
              <span className="relative flex items-center gap-2 text-primary">
                Enrol Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
