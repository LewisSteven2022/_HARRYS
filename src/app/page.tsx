'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a] z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Gym equipment"
            fill
            className="w-full h-full object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 w-full">
          {/* Script accent text */}
          <p className="accent-script text-2xl md:text-3xl lg:text-4xl mb-4">Fitness Journey</p>

          {/* Main HARRYS title */}
          <h1 className="hero-title mb-6">HARRYS</h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
            TRAIN WITH THE BEST
          </p>
          <p className="text-lg md:text-xl text-gray-400 mb-12">
            PERSONAL <span className="text-lime font-semibold">EXPERT</span> TRAINER
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/book-consultation" className="btn-lime text-sm font-semibold tracking-widest uppercase">
              Join the GYM
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          {/* Section header */}
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">What We Offer</h2>
          </div>

          {/* Services grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Workout Card */}
            <div className="card-rounded-lg card-glow p-8">
              <div className="icon-badge mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6.5 6.5h11M6.5 17.5h11M3 12h18M7 6.5V4M7 20v-2.5M17 6.5V4M17 20v-2.5" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-white mb-3 tracking-wide">Workout</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our workouts are tailored to accommodate all fitness levels, ensuring that everyone can participate.
              </p>
            </div>

            {/* Nutrition Card */}
            <div className="card-rounded-lg card-glow p-8">
              <div className="icon-badge mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-white mb-3 tracking-wide">Nutrition</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our mission is to provide you with valuable resources, expert guidance, and personalised nutrition.
              </p>
            </div>

            {/* Progression Card */}
            <div className="card-rounded-lg card-glow p-8">
              <div className="icon-badge mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-white mb-3 tracking-wide">Progression</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our focus on progression is what sets us apart and ensures that you experience continuous growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding-lg bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          {/* Section header */}
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">Our Pricing Plan</h2>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="pricing-card">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/images/barbell.jpg"
                  alt="Basic training"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lime font-semibold text-lg mb-2">Basic</h3>
                <div className="price mb-4">
                  £49<span>/per month</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-400 mb-6">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Single Day Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 Gym Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personal Trainer
                  </li>
                </ul>
                <Link
                  href="/book-consultation"
                  className="btn-lime-outline w-full justify-center text-xs font-semibold tracking-widest uppercase">
                  Get This Plan
                </Link>
              </div>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="pricing-card pricing-card-featured">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image src="/images/pro.jpg" alt="Pro training" fill className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lime font-semibold text-lg mb-2">Pro</h3>
                <div className="price mb-4">
                  £149<span>/per month</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-400 mb-6">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlimited Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 Gym Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personal Trainer
                  </li>
                </ul>
                <Link
                  href="/book-consultation"
                  className="btn-lime w-full justify-center text-xs font-semibold tracking-widest uppercase">
                  Get This Plan
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="pricing-card">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/images/premium.jpg"
                  alt="Premium training"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lime font-semibold text-lg mb-2">Premium</h3>
                <div className="price mb-4">
                  £249<span>/per month</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-400 mb-6">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlimited Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 Gym Access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personal Trainer
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Nutrition Plan + Diet
                  </li>
                </ul>
                <Link
                  href="/book-consultation"
                  className="btn-lime-outline w-full justify-center text-xs font-semibold tracking-widest uppercase">
                  Get This Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          {/* Section header */}
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">What Our Clients Say</h2>
          </div>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <span className="quote-mark">"</span>
              <p className="text-gray-300 leading-relaxed mb-6">
                "I've been training with Harry for several months, and I can't speak highly enough about the programs.
                The personalised approach and guidance have helped me make sustainable lifestyle changes and improve
                my overall well-being."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Client"
                />
                <div>
                  <p className="text-white font-semibold">James Mitchell</p>
                  <p className="text-gray-500 text-sm">Fitness Enthusiast</p>
                </div>
                <span className="testimonial-badge">"</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card bg-[#222]">
              <span className="quote-mark">"</span>
              <p className="text-gray-300 leading-relaxed mb-6">
                "Their personalised approach stood out to me. They took the time to assess my current fitness level,
                understand my objectives, and tailor a workout plan that was challenging yet achievable. The
                personalised meal plans have been game-changing."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Client"
                />
                <div>
                  <p className="text-white font-semibold">Sarah Thompson</p>
                  <p className="text-gray-500 text-sm">Personal Trainer</p>
                </div>
                <span className="testimonial-badge">"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Classes Section */}
      <section className="section-padding-lg bg-[#111111]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          {/* Section header */}
          <div className="flex items-center mb-12">
            <div className="triple-lines">
              <span></span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">Our Training Classes</h2>
          </div>

          {/* Classes grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Class 1 */}
            <div className="card-rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
                  alt="Cardio Strength"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Cardio Strength</h3>
                  <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mt-2">Combine the best of both worlds - cardio and strength training.</p>
                <div className="divider-lime w-full mt-4"></div>
              </div>
            </div>

            {/* Class 2 */}
            <div className="card-rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
                  alt="Weight Lifting"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Weight Lifting</h3>
                  <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mt-2">We are passionate about the art and science of lifting.</p>
                <div className="divider-lime w-full mt-4"></div>
              </div>
            </div>

            {/* Class 3 */}
            <div className="card-rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
                  alt="Body Balance"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Body Balance</h3>
                  <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mt-2">Achieving a state of body balance through focused training.</p>
                <div className="divider-lime w-full mt-4"></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/training" className="btn-lime-outline text-xs font-semibold tracking-widest uppercase">
              View All Classes
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="newsletter-section p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-md">
                <h2 className="font-display text-3xl md:text-4xl text-black tracking-wide mb-3">
                  Sign Up For Our Updates!
                </h2>
                <p className="text-gray-800 text-sm">
                  Stay up-to-date with the latest industry insights, product updates, and exclusive offers by
                  subscribing to our newsletter.
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="email"
                      placeholder="Enter Your Email Address"
                      className="w-full pl-12 pr-4 py-3 rounded-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full font-semibold text-sm tracking-wider uppercase bg-black text-white hover:bg-gray-800 transition-colors">
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
