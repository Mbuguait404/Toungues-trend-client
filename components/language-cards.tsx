import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LanguageCards() {
  const languages = [
    {
      flag: '🇫🇷',
      name: 'French',
      slug: 'french',
      description: 'Learn French from beginner to advanced. Master conversational skills, grammar, and cultural nuances with our native-speaking instructors.',
      cefrLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    {
      flag: '🇬🇧',
      name: 'English',
      slug: 'english',
      description: 'Improve your English proficiency whether for business, travel, or personal growth. Our teachers focus on practical communication skills.',
      cefrLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    {
      flag: '🇩🇪',
      name: 'German',
      slug: 'german',
      description: 'Discover the German language with structured lessons. Perfect for professionals, students, and language enthusiasts at any level.',
      cefrLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    {
      flag: '🇰🇪',
      name: 'Kiswahili',
      slug: 'kiswahili',
      description: 'Explore East African culture through Kiswahili. Ideal for those interested in African languages and cross-cultural communication.',
      cefrLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
  ]

  return (
    <section className="w-full bg-gray-light py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Language Courses
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Choose your language and start your learning journey today.</p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gold hover:shadow-lg transition-all duration-150"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: 'Poppins' }}>
                    {lang.flag} {lang.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-mid mb-6 leading-relaxed">{lang.description}</p>

              {/* CEFR Levels */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                  CEFR Levels Available
                </p>
                <div className="flex flex-wrap gap-2">
                  {lang.cefrLevels.map((level) => (
                    <span key={level} className="px-3 py-1 bg-gray-light rounded-full text-sm font-medium text-navy border border-gold">
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <Link
                  href={`/courses/${lang.slug}`}
                  className="flex-1 px-6 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150 text-center"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Explore Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
