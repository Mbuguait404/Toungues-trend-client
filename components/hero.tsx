import Image from 'next/image'
import { FaCalendarDays, FaVideo } from 'react-icons/fa6'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export default function Hero() {
  const languages = [
    { name: 'French', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_2_public.png' },
    { name: 'English', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_3_public.png' },
    { name: 'German', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_4_public.png' },
    { name: 'Kiswahili', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_5_public.png' },
  ]

  const trustBadges = ['Tailored Learning Plans', 'Flexible Scheduling', 'Expert Instructors', 'CEFR-Aligned Progress']

  return (
    <section
      className="relative isolate flex min-h-screen min-h-svh w-full items-center overflow-hidden bg-navy bg-cover bg-center bg-no-repeat text-white pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28"
      style={{ backgroundImage: "url('/images/home/imgi_3_public.png')" }}
    >
      <div className="absolute inset-0 bg-navy/90" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-12 sm:mb-16">
          <Reveal as="h1" distance={32} duration={0.7}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance"
            style={{ fontFamily: 'Poppins' }}
          >
            Unlock Your Language Potential with Expert Tutoring
          </Reveal>
          <Reveal as="p" delay={0.12}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Personalized tutoring in French, English, German, and Kiswahili to help you build fluency, confidence, and real communication skills.
          </Reveal>

          {/* CTAs */}
          <Reveal as="div" delay={0.24} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              <FaVideo size={18} aria-hidden="true" />
              Start Learning
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-navy transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              <FaCalendarDays size={18} aria-hidden="true" />
              Book Your Free Trial
            </button>
          </Reveal>

          {/* Trust Badges */}
          <Stagger as="div" delay={0.34} stagger={0.09} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {trustBadges.map((badge) => (
              <StaggerItem key={badge} className="text-sm sm:text-base font-medium text-gray-300">
                ✓ {badge}
              </StaggerItem>
            ))}
          </Stagger>

          {/* Language Pills */}
          <Stagger as="div" delay={0.44} stagger={0.08} className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <StaggerItem
                key={lang.name}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-full text-sm text-gray-300 font-medium backdrop-blur"
              >
                <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/40 bg-white/10">
                  <Image src={lang.flag} alt={`${lang.name} flag`} fill className="object-cover" />
                </div>
                <span>{lang.name}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
