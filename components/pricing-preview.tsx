import { Check } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export default function PricingPreview() {
  const pricingPlans = [
    {
      name: 'Single Lesson',
      price: '30',
      currency: 'EUR',
      description: 'Perfect for testing our service',
      features: [
        '60-minute 1-on-1 lesson',
        'CEFR certified teacher',
        'Flexible scheduling',
        'Lesson materials included',
      ],
    },
    {
      name: 'Course Bundle',
      price: '275',
      currency: 'EUR',
      description: 'Best value for regular learners',
      features: [
        '10 × 60-minute lessons',
        'CEFR certified teachers',
        'Flexible scheduling',
        'Self-study portal access',
        'Digital certificate included',
      ],
      highlighted: true,
    },
  ]

  return (
    <section className="w-full bg-gray-light py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Reveal className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">
            Quality language instruction at affordable rates. Available in EUR, CHF, USD, and KES.
          </p>
        </Reveal>

        {/* Pricing Cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-12" stagger={0.12} amount={0.1}>
          {pricingPlans.map((plan) => (
            <StaggerItem
              key={plan.name}
              className={`rounded-2xl border p-8 lg:p-10 transition-all duration-150 ${
                plan.highlighted
                  ? 'bg-white border-gold shadow-lg md:scale-105 md:z-10'
                  : 'bg-white border-gray-100 hover:border-gold hover:shadow-lg'
              }`}
            >
              {/* Header */}
              <h3 className="text-2xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                {plan.name}
              </h3>
              <p className="text-gray-mid text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                  {plan.price}
                </span>
                <span className="text-lg text-gray-mid ml-2">{plan.currency}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-dark">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="w-full px-6 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-light transition-all duration-150" style={{ fontFamily: 'Poppins' }}>
                Get Started
              </button>
            </StaggerItem>
          ))}
        </Stagger>

        {/* See All Plans CTA */}
        <Reveal className="text-center" delay={0.12}>
          <button className="px-8 py-3 rounded-full border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-navy transition-all duration-150" style={{ fontFamily: 'Poppins' }}>
            See All Plans
          </button>
        </Reveal>
      </div>
    </section>
  )
}
