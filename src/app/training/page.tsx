import Link from 'next/link';

export default function Training() {
  const classes = [
    {
      name: 'Power Play',
      description: 'Move with intent. A session encompassing full body movement patterns with speed and impetus creating the appropriate stimulus to unlock our bodies full potential.',
      features: ['Full body movement patterns', 'Speed and power focus', 'Explosive training', 'All fitness levels'],
      price: '£15',
      type: 'Indoor',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Lift & Shift',
      description: 'Strength-focused classes derived from professional training experience, centering on compound movement patterns with progressive training blocks and form-focused progressions/regressions.',
      features: ['Compound movements', 'Progressive training blocks', 'Form-focused coaching', 'Strength building'],
      price: '£15',
      type: 'Indoor',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      name: 'Engine Room',
      description: 'Designed to build cardiovascular fitness and fatigue tolerance through high-intensity mixed modality workouts that test aerobic capacity.',
      features: ['Cardiovascular focus', 'High-intensity intervals', 'Mixed modality training', 'Build endurance'],
      price: '£15',
      type: 'Indoor',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      name: 'Cardio Club',
      description: 'Saturday group sessions described as a high intensity, lung busting workout featuring mixed modalities in a supportive community environment.',
      features: ['Saturday sessions', 'Community atmosphere', 'Mixed modalities', 'High energy'],
      price: '£12.50',
      type: 'Outdoor Bootcamp',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Mum Club',
      description: 'A safe, supportive, and energising space for mums to move, sweat, and connect. Focused on strength rebuilding and mental wellness.',
      features: ['Safe for new mums', 'Strength rebuilding', 'Mental wellness focus', 'Supportive community'],
      price: '£10',
      type: 'Specialist',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <p className="accent-script text-xl md:text-2xl mb-2">Our Classes</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">TRAINING PROGRAMS</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            From high-intensity power sessions to supportive community workouts, we have a class for every fitness level and goal.
          </p>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="grid gap-8">
            {classes.map((classItem, index) => (
              <div
                key={index}
                className="card-rounded-lg p-8 grid md:grid-cols-3 gap-8 items-start"
              >
                {/* Left - Icon and Name */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0 text-lime">
                    {classItem.icon}
                  </div>
                  <div>
                    <span className="text-lime text-xs font-semibold uppercase tracking-wider">{classItem.type}</span>
                    <h3 className="font-display text-2xl text-white tracking-wide">{classItem.name}</h3>
                    <p className="text-lime font-semibold mt-1">{classItem.price}<span className="text-gray-500 font-normal">/session</span></p>
                  </div>
                </div>

                {/* Middle - Description */}
                <div>
                  <p className="text-gray-300 leading-relaxed">{classItem.description}</p>
                </div>

                {/* Right - Features */}
                <div>
                  <ul className="space-y-2">
                    {classItem.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-lime flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="section-padding-lg bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">Pricing Overview</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-lime mb-2">£12.50</p>
              <p className="text-white font-semibold">Single Bootcamp</p>
              <p className="text-gray-500 text-sm mt-1">Outdoor sessions</p>
            </div>

            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-lime mb-2">£72</p>
              <p className="text-white font-semibold">6-Pack Bootcamps</p>
              <p className="text-gray-500 text-sm mt-1">Save £3/session</p>
            </div>

            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-lime mb-2">£15</p>
              <p className="text-white font-semibold">Single Indoor Class</p>
              <p className="text-gray-500 text-sm mt-1">Power Play, Lift & Shift, Engine Room</p>
            </div>

            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-lime mb-2">£84</p>
              <p className="text-white font-semibold">6-Pack Indoor</p>
              <p className="text-gray-500 text-sm mt-1">Save £6/session</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              <span className="text-lime font-semibold">Mum Club</span> - £10 per session
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-6">Ready to Start?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Check the schedule and book your first session. All fitness levels welcome - we&apos;ll meet you where you are.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/timetable" className="btn-lime text-sm font-semibold tracking-widest uppercase">
              View Schedule
            </Link>
            <Link href="/coach" className="btn-lime-outline text-sm font-semibold tracking-widest uppercase">
              Meet Harry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
