'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Award, Globe, Users, Zap } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Globe,
      title: 'Global Excellence',
      description: 'Teachers from Kenya, Europe, and beyond bringing diverse perspectives and authentic language expertise to every lesson.',
    },
    {
      icon: Users,
      title: 'Student-Centered Learning',
      description: 'Personalized 1-on-1 instruction tailored to your pace, goals, and learning style for maximum progress.',
    },
    {
      icon: Award,
      title: 'Quality & Certification',
      description: 'All instructors are certified language professionals with years of experience teaching at all CEFR levels.',
    },
    {
      icon: Zap,
      title: 'Accessible Learning',
      description: 'Flexible scheduling, affordable pricing, and premium materials make expert language training attainable for everyone.',
    },
  ]

  const aboutImages = [
    {
      src: '/images/About Us - Our Mission, Team, and Approach to Language Education/imgi_2_public.jpg',
      alt: 'Students learning online with Tongues Trend tutors',
    },
    {
      src: '/images/About Us - Our Mission, Team, and Approach to Language Education/imgi_3_public.png',
      alt: 'Language learning mentorship and tutoring session',
    },
    {
      src: '/images/About Us - Our Mission, Team, and Approach to Language Education/imgi_4_public.png',
      alt: 'Tongues Trend learning support and student engagement',
    },
    {
      src: '/images/About Us - Our Mission, Team, and Approach to Language Education/imgi_5_public.webp',
      alt: 'Interactive online language education environment',
    },
  ]

  const teachers = [
    {
      name: 'Marie Dupont',
      country: 'France',
      languages: 'French, English',
      expertise: 'CEFR A1-C2 | Conversational & Professional',
      initials: 'MD',
    },
    {
      name: 'Dr. James Kariuki',
      country: 'Kenya',
      languages: 'Kiswahili, English',
      expertise: 'CEFR A1-C2 | Corporate & Academic',
      initials: 'JK',
    },
    {
      name: 'Klaus Weber',
      country: 'Germany',
      languages: 'German, English',
      expertise: 'CEFR A1-C2 | Business & Culture',
      initials: 'KW',
    },
    {
      name: 'Emma Thompson',
      country: 'United Kingdom',
      languages: 'English, French',
      expertise: 'CEFR A1-C2 | Exam Prep & Fluency',
      initials: 'ET',
    },
    {
      name: 'Amira Hassan',
      country: 'Kenya',
      languages: 'Kiswahili, English, Arabic',
      expertise: 'CEFR A1-B2 | Cultural Immersion',
      initials: 'AH',
    },
    {
      name: 'Sophia Mueller',
      country: 'Switzerland',
      languages: 'German, French, English',
      expertise: 'CEFR A1-C1 | Multilingual Fluency',
      initials: 'SM',
    },
    {
      name: 'Kwame Agyeman',
      country: 'Kenya',
      languages: 'English, Kiswahili',
      expertise: 'CEFR A1-C1 | Young Learners & IELTS',
      initials: 'KA',
    },
  ]

  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-navy text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance" style={{ fontFamily: 'Poppins' }}>
            Discover Our Journey and Services at Tongues Trend
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We began with a passion for breaking language barriers in 2025 and have grown into a platform offering personalized tutoring in French, English, German, and Kiswahili.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6" style={{ fontFamily: 'Poppins' }}>
                Our Story
              </h2>
              <p className="text-gray-dark leading-relaxed mb-4">
                At Tongues Trend, we began with a passion for breaking language barriers. Founded in 2025, our journey started with a small team of dedicated linguists and has since expanded into a comprehensive platform offering personalized tutoring in French, English, German, and Kiswahili.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                Our expert instructors are committed to providing tailored learning experiences that cater to each student's unique needs, helping them achieve fluency and confidence in their chosen languages.
              </p>
              <p className="text-gray-dark leading-relaxed">
                Whether you are learning for travel, work, school, or personal growth, every lesson is designed to help you progress at your own pace with clarity and confidence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                <Image
                  src={aboutImages[0].src}
                  alt={aboutImages[0].alt}
                  width={1200}
                  height={900}
                  className="w-full h-[360px] object-cover"
                  priority
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {aboutImages.slice(1).map((image) => (
                  <div key={image.src} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={700}
                      height={500}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-gray-light rounded-2xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-mid text-sm font-medium">Expert Teachers</span>
                    <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                      7+
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-mid text-sm font-medium">Active Students</span>
                    <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                      500+
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-mid text-sm font-medium">Languages Taught</span>
                    <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                      4
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-mid text-sm font-medium">Countries Served</span>
                    <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                      12+
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-gray-light py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-16" style={{ fontFamily: 'Poppins' }}>
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150"
                >
                  <div className="mb-4 p-3 bg-gold bg-opacity-10 rounded-lg w-fit">
                    <Icon className="text-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-dark text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4" style={{ fontFamily: 'Poppins' }}>
            Meet Our Teachers
          </h2>
          <p className="text-gray-mid text-center mb-16 max-w-2xl mx-auto">
            Certified language professionals dedicated to your success. Each brings unique expertise, cultural insight, and a passion for teaching.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center">
                    <span className="text-navy font-bold text-lg" style={{ fontFamily: 'Poppins' }}>
                      {teacher.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gold font-medium">{teacher.country}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-dark mb-3">
                  <span className="font-semibold">Languages:</span> {teacher.languages}
                </p>
                <p className="text-sm text-gray-mid">{teacher.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-navy text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gold" style={{ fontFamily: 'Poppins' }}>
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Connect with our expert teachers and begin your language journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <button
                className="px-8 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150"
                style={{ fontFamily: 'Poppins' }}
              >
                Explore Courses
              </button>
            </Link>
            <button
              className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-navy transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
