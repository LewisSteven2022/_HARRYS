import Link from 'next/link';

export default function Results() {
  const testimonials = [
    {
      name: 'Sue Helen Nieto',
      initials: 'SN',
      category: 'Pregnancy & Postpartum',
      headline: '95kg Deadlift at 8 Months Pregnant',
      story: `Sue consistently showed up to her training sessions throughout her pregnancy, demonstrating incredible dedication to her fitness journey. Her commitment paid off in remarkable ways.`,
      results: [
        'Hit 95kg sumo deadlift PB at 8 months pregnant',
        'Returned to gym training just 2 months postpartum',
        'Experienced no diastasis recti',
        'Currently working toward pre-pregnancy performance benchmarks',
      ],
      quote: 'Training through pregnancy was one of the best decisions I made. Harry adapted every session to my changing body while still keeping me challenged.',
    },
    {
      name: 'Luke Rankin',
      initials: 'LR',
      category: '30kg Weight Loss',
      headline: 'Complete Lifestyle Transformation',
      story: `Luke came to Harry's with a goal to get below 85kg, starting at 110kg. Over two years of consistent twice-weekly strength training and cardio classes, he achieved far more than he ever imagined.`,
      results: [
        'Lost 30kg in total body weight',
        'Reduced body fat by 15.8%',
        'Visceral fat score dropped from 17 to 6',
        'Complete transformation of lifestyle habits and diet',
        'Significant improvements in mental health',
      ],
      quote: 'His confidence has grown immensely after completely changing his lifestyle habits and dietary patterns.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <p className="accent-script text-xl md:text-2xl mb-2">Success Stories</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">REAL RESULTS</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Our clients achieve incredible transformations through consistent training, expert coaching, and a supportive community. Here are some of their stories.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="space-y-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-rounded-lg p-8 md:p-12"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left - Profile */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center text-lime text-xl font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{testimonial.name}</h3>
                        <span className="text-lime text-sm">{testimonial.category}</span>
                      </div>
                    </div>

                    <h4 className="font-display text-2xl text-white tracking-wide mb-4">
                      {testimonial.headline}
                    </h4>

                    <p className="text-gray-400 leading-relaxed">
                      {testimonial.story}
                    </p>
                  </div>

                  {/* Middle - Results */}
                  <div>
                    <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Results
                    </h5>
                    <ul className="space-y-3">
                      {testimonial.results.map((result, resultIndex) => (
                        <li key={resultIndex} className="flex items-start gap-3 text-gray-300">
                          <svg className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right - Quote */}
                  <div className="flex items-center">
                    <blockquote className="relative">
                      <span className="absolute -top-4 -left-2 text-6xl text-lime/20 font-serif">&ldquo;</span>
                      <p className="text-gray-300 italic text-lg leading-relaxed pl-6">
                        {testimonial.quote}
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding-lg bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">By the Numbers</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-lime mb-2">14+</p>
              <p className="text-gray-400">Years Experience</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-lime mb-2">100%</p>
              <p className="text-gray-400">Dedication</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-lime mb-2">5</p>
              <p className="text-gray-400">Class Types</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-lime mb-2">All</p>
              <p className="text-gray-400">Fitness Levels Welcome</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-6">Our Approach to Results</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Results at Harry&apos;s aren&apos;t just about the numbers on the scale. We focus on building strength, improving movement quality, and creating sustainable habits that transform your entire lifestyle.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 border border-gray-800 rounded-xl">
                <h3 className="text-lime font-semibold mb-2">Consistent Training</h3>
                <p className="text-gray-400 text-sm">Show up regularly, and results will follow. Our structured programming keeps you accountable.</p>
              </div>
              <div className="p-6 border border-gray-800 rounded-xl">
                <h3 className="text-lime font-semibold mb-2">Expert Coaching</h3>
                <p className="text-gray-400 text-sm">Every session is led with impeccable standards and attention to your individual needs.</p>
              </div>
              <div className="p-6 border border-gray-800 rounded-xl">
                <h3 className="text-lime font-semibold mb-2">Community Support</h3>
                <p className="text-gray-400 text-sm">Join a pack of like-minded individuals who lift each other up every session.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-lg bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Every transformation starts with a single session. Join the pack and discover what you&apos;re capable of.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/timetable" className="btn-lime text-sm font-semibold tracking-widest uppercase">
              Book Your First Session
            </Link>
            <Link href="/contact" className="btn-lime-outline text-sm font-semibold tracking-widest uppercase">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
