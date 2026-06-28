import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Amara K.',
      country: 'Kenya',
      language: 'French',
      quote: 'The personalized approach and my teacher&apos;s expertise made learning French engaging and effective. I&apos;ve progressed faster than I expected.',
      initials: 'AK',
      rating: 5,
    },
    {
      name: 'Sophie L.',
      country: 'France',
      language: 'English',
      quote: 'After just 3 months of lessons, I can hold conversations confidently. The flexible scheduling fits perfectly with my work life.',
      initials: 'SL',
      rating: 5,
    },
    {
      name: 'Mohammed A.',
      country: 'UAE',
      language: 'German',
      quote: 'The structured curriculum and certified teachers made all the difference. Worth every euro spent on my language journey.',
      initials: 'MA',
      rating: 5,
    },
  ]

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Testimonials
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Hear from our happy students around the world.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gold hover:shadow-lg transition-all duration-150"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-dark mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

              {/* Footer */}
              <div className="flex items-start gap-4 pt-6 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-navy text-sm" style={{ fontFamily: 'Poppins' }}>
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-mid">
                    {testimonial.country} · {testimonial.language}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
