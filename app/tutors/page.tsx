import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Clock, Globe, BookOpen, GraduationCap, Star, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutors | Tongues Trend – Meet Our Expert Language Teachers',
  description:
    'Browse our certified, experienced tutors at Tongues Trend. Book a personalized session in English, Kiswahili, Mathematics, Sciences and more.',
}

const tutors = [
  {
    id: 1,
    initials: 'RAO',
    name: 'Rita Akinyi Onyango',
    title: 'Elementary English & Kiswahili Specialist',
    experience: '8 Years',
    qualification: 'B.A. Elementary Education (English Specialization)',
    bio: [
      'Dedicated elementary English teacher with 8 years of experience fostering literacy and a love for language in early learners.',
      'Holds a B.A. in Elementary Education with a specialization in English Activities.',
      'Committed to building confident communicators through engaging, student-centered instruction, while partnering with families to support each child\'s academic growth, development, and creative expression.',
    ],
    languages: ['English Language', 'Kiswahili'],
    availability: [
      { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
      { day: 'Sunday', time: '4:00 PM – 6:00 PM' },
    ],
    highlights: [
      'Student-centered teaching approach',
      'Literacy & early language development',
      'Family partnership & academic support',
      'Creative expression & confidence building',
    ],
    hasMaterials: true,
    rating: 5.0,
    reviewCount: 24,
    gradient: 'from-navy to-[#2d6bc4]',
    tagBg: 'bg-navy/10',
    tagText: 'text-navy',
    borderHover: 'hover:border-navy',
  },
  {
    id: 2,
    initials: 'LAO',
    name: 'Lucy Adhiambo Onyango',
    title: 'Mathematics, Sciences & Languages Tutor',
    experience: '5 Years',
    qualification: 'Qualified Teacher – Mathematics & Sciences',
    bio: [
      'Qualified teacher of Mathematics and Sciences with 5 years of experience inspiring students across STEM disciplines.',
      'Also proficient in teaching languages, offering a unique cross-disciplinary approach to learning.',
      'Available once a week for focused, personalized sessions tailored live to each student\'s unique needs.',
    ],
    languages: ['Mathematics', 'Sciences', 'Languages (General)'],
    availability: [
      { day: 'Thursday', time: '10:00 AM onwards (weekly)' },
    ],
    highlights: [
      'Cross-disciplinary STEM & Language teaching',
      'Personalized, tailored lessons',
      'Analytical and communicative skill-building',
      'Flexible, student-led session pace',
    ],
    hasMaterials: false,
    rating: 4.8,
    reviewCount: 17,
    gradient: 'from-gold to-[#FDC76F]',
    tagBg: 'bg-gold/10',
    tagText: 'text-[#c17c00]',
    borderHover: 'hover:border-gold',
  },
]

export default function TutorsPage() {
  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1a3f7a] to-[#0d2550]">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-semibold mb-6 tracking-wide">
            Our Expert Tutors
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
            Learn From <span className="text-gold">Passionate</span> Educators
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Meet the dedicated teachers behind Tongues Trend — certified professionals who bring warmth, expertise, and personalized attention to every session.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-bold rounded-full hover:bg-gold-light transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ fontFamily: 'Poppins' }}
            >
              Book a Session
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200"
              style={{ fontFamily: 'Poppins' }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '2', label: 'Expert Tutors' },
              { value: '13+', label: 'Combined Years' },
              { value: '4+', label: 'Subjects Taught' },
              { value: '41+', label: 'Student Reviews' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: 'Poppins' }}>{stat.value}</p>
                <p className="text-sm text-gray-mid font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors List */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {tutors.map((tutor, idx) => (
              <div
                key={tutor.id}
                className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${tutor.borderHover}`}
              >
                {/* Gradient stripe */}
                <div className={`h-2 bg-gradient-to-r ${tutor.gradient}`} />

                <div className="p-8 lg:p-12">
                  <div className={`flex flex-col lg:flex-row gap-10 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Left: Avatar + Quick Info */}
                    <div className="lg:w-72 flex-shrink-0">
                      {/* Avatar */}
                      <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${tutor.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                        <span className="text-white font-bold text-3xl" style={{ fontFamily: 'Poppins' }}>
                          {tutor.initials}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.round(tutor.rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-navy">{tutor.rating}</span>
                        <span className="text-sm text-gray-mid">({tutor.reviewCount} reviews)</span>
                      </div>

                      {/* Quick stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <GraduationCap size={16} className="text-gold flex-shrink-0" />
                          <span className="text-sm text-gray-dark font-medium">{tutor.experience} experience</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen size={16} className="text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-dark font-medium leading-snug">{tutor.qualification}</span>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="bg-gray-light rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={15} className="text-gold" />
                          <span className="text-xs font-bold text-navy uppercase tracking-wide">Availability</span>
                        </div>
                        <div className="space-y-2">
                          {tutor.availability.map((slot) => (
                            <div key={slot.day} className="flex items-start gap-2">
                              <span className="w-2 h-2 rounded-full bg-green flex-shrink-0 mt-1.5" />
                              <div>
                                <p className="text-sm font-semibold text-navy">{slot.day}</p>
                                <p className="text-xs text-gray-mid">{slot.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1">
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                          {tutor.name}
                        </h2>
                        <p className="text-gold font-semibold text-lg">{tutor.title}</p>
                      </div>

                      {/* Bio */}
                      <div className="mb-6 space-y-3">
                        {tutor.bio.map((para, i) => (
                          <p key={i} className="text-gray-dark leading-relaxed">{para}</p>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe size={16} className="text-gold" />
                          <span className="text-sm font-bold text-navy uppercase tracking-wide">Subjects & Languages</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tutor.languages.map((lang) => (
                            <span
                              key={lang}
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${tutor.tagBg} ${tutor.tagText} border border-current/20`}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-6">
                        <p className="text-sm font-bold text-navy uppercase tracking-wide mb-3">What You'll Experience</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tutor.highlights.map((h) => (
                            <div key={h} className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-green flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-dark">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Materials note */}
                      {!tutor.hasMaterials && (
                        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                          <BookOpen size={16} className="text-amber-500 flex-shrink-0" />
                          <p className="text-sm text-amber-700 font-medium">
                            No pre-prepared materials — all lessons are tailored live to your needs.
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href="/contact"
                          className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm bg-gradient-to-r ${tutor.gradient} text-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                          style={{ fontFamily: 'Poppins' }}
                        >
                          Book a Session
                          <ArrowRight size={16} />
                        </Link>
                        <Link
                          href="/courses"
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border-2 border-gray-200 text-navy hover:border-navy transition-all duration-200"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          View Courses
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join as a Tutor CTA */}
      <section className="py-20 bg-gradient-to-br from-navy to-[#1a3f7a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Are You a Teacher?
          </h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Join Tongues Trend as a tutor and connect with eager learners. Share your knowledge and grow your teaching career with our platform.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-navy font-bold rounded-full hover:bg-gold-light transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ fontFamily: 'Poppins' }}
          >
            Join as a Tutor
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
