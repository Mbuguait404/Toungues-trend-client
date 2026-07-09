import Link from 'next/link'
import { ArrowRight, Clock, BookOpen, Globe } from 'lucide-react'

const tutors = [
  {
    id: 1,
    initials: 'RAO',
    name: 'Rita Akinyi Onyango',
    title: 'Elementary English & Kiswahili Teacher',
    experience: '8 Years Experience',
    bio: 'Dedicated elementary English teacher fostering literacy and a love for language in early learners. Holds a B.A. in Elementary Education with a specialization in English Activities.',
    languages: ['English Language', 'Kiswahili'],
    availability: [
      { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
      { day: 'Sunday', time: '4:00 PM – 6:00 PM' },
    ],
    color: 'from-navy to-[#2d6bc4]',
    accentColor: 'bg-navy',
    tagColor: 'bg-navy/10 text-navy',
    hasMaterials: true,
  },
  {
    id: 2,
    initials: 'LAO',
    name: 'Lucy Adhiambo Onyango',
    title: 'Mathematics, Sciences & Languages Teacher',
    experience: '5 Years Experience',
    bio: 'Qualified teacher of Mathematics and Sciences with the ability to also teach languages. Passionate about nurturing students\' analytical and communicative skills.',
    languages: ['Mathematics', 'Sciences', 'Languages'],
    availability: [
      { day: 'Thursday', time: '10:00 AM onwards' },
    ],
    color: 'from-gold to-[#FDC76F]',
    accentColor: 'bg-gold',
    tagColor: 'bg-gold/10 text-[#c17c00]',
    hasMaterials: false,
  },
  {
    id: 3,
    initials: 'SN',
    name: 'Samson Namusya',
    title: 'German & Languages Tutor',
    experience: '5 Years Experience',
    bio: 'I am a degree holder with 5 years of experience teaching German and a Goethe-certified tutor. I am passionate about helping students build confidence and achieve their language goals through engaging, practical, and effective teaching methods.',
    languages: ['German', 'IELTS', 'English', 'Kiswahili'],
    availability: [
      { day: 'Daily', time: '8:00 AM – 10:00 PM' },
    ],
    color: 'from-[#059669] to-[#34d399]',
    accentColor: 'bg-[#059669]',
    tagColor: 'bg-[#059669]/10 text-[#059669]',
    hasMaterials: true,
  },
]

export default function TutorsSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 bg-gold/10 text-[#c17c00] rounded-full text-sm font-semibold mb-4 tracking-wide">
            Meet Our Tutors
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Learn From the Best
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto leading-relaxed">
            Our certified, experienced tutors are committed to helping you achieve fluency and confidence in every lesson.
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gold hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient top bar */}
              <div className={`h-2 bg-gradient-to-r ${tutor.color}`} />

              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tutor.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins' }}>
                      {tutor.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-navy leading-tight mb-1" style={{ fontFamily: 'Poppins' }}>
                      {tutor.name}
                    </h3>
                    <p className="text-sm text-gray-mid font-medium leading-snug">{tutor.title}</p>
                    <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${tutor.tagColor}`}>
                      {tutor.experience}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-dark leading-relaxed text-sm mb-6">
                  {tutor.bio}
                </p>

                {/* Languages */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={15} className="text-gold" />
                    <span className="text-xs font-bold text-navy uppercase tracking-wide">Languages Taught</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-gray-light rounded-full text-xs font-semibold text-navy border border-gold/40"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={15} className="text-gold" />
                    <span className="text-xs font-bold text-navy uppercase tracking-wide">Availability</span>
                  </div>
                  <div className="space-y-1.5">
                    {tutor.availability.map((slot) => (
                      <div key={slot.day} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
                        <span className="text-sm text-gray-dark">
                          <span className="font-semibold">{slot.day}</span>
                          <span className="text-gray-mid"> · {slot.time}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials note */}
                {tutor.hasMaterials === false && (
                  <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <BookOpen size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="text-xs text-amber-700 font-medium">
                      No pre-prepared learning materials — lessons are tailored live
                    </span>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href="/contact"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-all duration-200 bg-gradient-to-r ${tutor.color} text-white hover:shadow-md hover:-translate-y-0.5`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Book a Session
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-navy text-navy font-semibold rounded-full hover:bg-navy hover:text-white transition-all duration-200"
            style={{ fontFamily: 'Poppins' }}
          >
            View All Tutors
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
