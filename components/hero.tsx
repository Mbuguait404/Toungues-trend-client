export default function Hero() {
  const languages = [
    { flag: '🇫🇷', name: 'French' },
    { flag: '🇬🇧', name: 'English' },
    { flag: '🇩🇪', name: 'German' },
    { flag: '🇰🇪', name: 'Kiswahili' },
  ]

  const trustBadges = ['Tailored Learning Plans', 'Flexible Scheduling', 'Expert Instructors', 'CEFR-Aligned Progress']

  return (
    <section className="w-full bg-navy text-white pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance"
            style={{ fontFamily: 'Poppins' }}
          >
            Unlock Your Language Potential with Expert Tutoring
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
            Personalized tutoring in French, English, German, and Kiswahili to help you build fluency, confidence, and real communication skills.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              className="px-8 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              Start Learning
            </button>
            <button
              className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-navy transition-all duration-150"
              style={{ fontFamily: 'Poppins' }}
            >
              Book Your Free Trial
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {trustBadges.map((badge) => (
              <div key={badge} className="text-sm sm:text-base font-medium text-gray-300">
                ✓ {badge}
              </div>
            ))}
          </div>

          {/* Language Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="px-4 py-2 bg-white bg-opacity-10 rounded-full text-sm text-gray-300 font-medium backdrop-blur"
              >
                {lang.flag} {lang.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
