import { Reveal } from '@/components/motion'

export default function CTABanner() {
  return (
    <section className="w-full bg-navy text-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <Reveal as="h2" delay={0} duration={0.7} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gold" style={{ fontFamily: 'Poppins' }}>
          Ready to Start Your Language Journey?
        </Reveal>

        {/* Subheading */}
        <Reveal as="p" delay={0.14} className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          Book a free 30-minute consultation. No commitment required. Our advisors will help you find the perfect learning path.
        </Reveal>

        {/* CTA Button */}
        <Reveal direction="none" delay={0.28} duration={0.5} amount={0.1}>
          <button
            className="px-10 py-4 rounded-full bg-gold text-navy font-bold text-lg hover:bg-gold-light transition-all duration-150"
            style={{ fontFamily: 'Poppins' }}
          >
            Book Free Consultation
          </button>
        </Reveal>
      </div>
    </section>
  )
}
