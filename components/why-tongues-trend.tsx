import { Video, Trophy, Clock, Globe, Award, Users } from 'lucide-react'

export default function WhyTonguesTrend() {
  const features = [
    {
      title: '1-on-1 Live Lessons on Zoom',
      description: 'Personalized lessons tailored to your goals, pace, and learning style with individual attention.',
      icon: Video,
    },
    {
      title: 'CEFR Aligned Curriculum (A1 → C2)',
      description: 'Structured learning path from complete beginner to near-native fluency following international standards.',
      icon: Trophy,
    },
    {
      title: 'Self-Study Portal with Materials',
      description: 'Access resources, practice exercises, and learning materials between lessons to accelerate progress.',
      icon: Clock,
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book lessons at times that suit your schedule. No fixed contracts or rigid timetables required.',
      icon: Globe,
    },
    {
      title: 'Digital Certificates on Completion',
      description: 'Earn recognized CEFR certificates upon completing each language level to showcase your skills.',
      icon: Award,
    },
    {
      title: 'Teachers from Kenya, Europe & Beyond',
      description: 'Learn from certified native and fluent speakers with diverse backgrounds and professional expertise.',
      icon: Users,
    },
  ]

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Why Tongues Trend
          </h2>
          <p className="text-lg text-gray-mid max-w-2xl mx-auto">Premium features designed for serious language learners.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-gold hover:shadow-lg transition-all duration-150"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-10 h-10 text-gold" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-mid leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
