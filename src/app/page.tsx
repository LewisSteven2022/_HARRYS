"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<>
			{/* Hero Section */}
			<section className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
				{/* Background image with overlay */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a] z-10"></div>
					<Image
						src="/images/harry-1.jpeg"
						alt="Harry's JSY Functional Fitness"
						fill
						className="w-full h-full object-cover opacity-40"
						priority
					/>
				</div>

				<div className="relative z-10 text-center px-4 w-full">
					{/* Caption */}
					<p className="text-lime text-sm md:text-base lg:text-lg font-semibold tracking-widest uppercase mb-4">
						Functional Fitness
					</p>

					{/* Main title */}
					<h1 className="hero-title mb-6">HARRYS</h1>

					{/* Tagline */}
					<p className="text-base md:text-lg lg:text-xl text-gray-300 mb-2 max-w-2xl mx-auto">
						Jersey&apos;s home of Functional Fitness
					</p>
					<p className="text-sm md:text-base text-gray-400 mb-10 max-w-lg mx-auto">
						The pack is forming. Maximum energy, all fitness levels welcome.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
						<Link
							href="/timetable"
							className="btn-lime text-sm font-semibold tracking-widest uppercase">
							Join the Pack
						</Link>
						<Link
							href="/coach"
							className="btn-lime-outline text-sm font-semibold tracking-widest uppercase">
							Meet Harry
						</Link>
					</div>
				</div>
			</section>

			{/* Why Harry's Section - 4 Pillars */}
			<section className="section-padding-lg">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
					{/* Section header */}
					<div className="flex items-center mb-12">
						<div className="triple-lines">
							<span></span>
						</div>
						<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
							Why Harry&apos;s?
						</h2>
					</div>

					{/* 4 Pillars grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Pillar 1 */}
						<div className="card-rounded-lg card-glow p-8">
							<div className="icon-badge mb-6">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<path d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="font-display text-xl text-white mb-3 tracking-wide">
								Muscle Recruitment
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Type II muscle fibres are responsible for our &apos;fast
								twitch&apos; movements. Our training recruits muscle fibers
								typically neglected in conventional routines.
							</p>
						</div>

						{/* Pillar 2 */}
						<div className="card-rounded-lg card-glow p-8">
							<div className="icon-badge mb-6">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<h3 className="font-display text-xl text-white mb-3 tracking-wide">
								Activation & Prevention
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Dormant Type II fibers atrophy during adulthood without
								stimulation. Strategic power training maintains muscle mass and
								improves dynamic balance.
							</p>
						</div>

						{/* Pillar 3 */}
						<div className="card-rounded-lg card-glow p-8">
							<div className="icon-badge mb-6">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="font-display text-xl text-white mb-3 tracking-wide">
								Purpose & Accountability
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Structured programming with test weeks and manipulation of
								variables provides quantifiable progress markers. Physical
								development builds mental resilience.
							</p>
						</div>

						{/* Pillar 4 */}
						<div className="card-rounded-lg card-glow p-8">
							<div className="icon-badge mb-6">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
							</div>
							<h3 className="font-display text-xl text-white mb-3 tracking-wide">
								Variety
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								We reject repetitive training. Using diverse exercises and
								variable manipulation to prevent stagnation and recruit
								different muscle groups.
							</p>
						</div>
					</div>

					{/* Quote */}
					<div className="mt-12 text-center">
						<blockquote className="text-xl md:text-2xl text-gray-300 italic max-w-3xl mx-auto">
							&quot;A ship in the harbour is safe, but that&apos;s not what they
							are built for&quot;
						</blockquote>
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
						<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
							Pricing
						</h2>
					</div>

					{/* Pricing cards */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Single Bootcamp */}
						<div className="pricing-card">
							<div className="p-6">
								<h3 className="text-lime font-semibold text-lg mb-2">
									Single Bootcamp
								</h3>
								<div className="price mb-4">
									£12.50<span>/session</span>
								</div>
								<ul className="space-y-3 text-sm text-gray-400 mb-6">
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Outdoor functional fitness
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										All fitness levels
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Expert coaching
									</li>
								</ul>
								<Link
									href="/timetable"
									className="btn-lime-outline w-full justify-center text-xs font-semibold tracking-widest uppercase">
									Book Now
								</Link>
							</div>
						</div>

						{/* 6-Pack Bootcamps (Featured) */}
						<div className="pricing-card pricing-card-featured">
							<div className="p-6">
								<h3 className="text-lime font-semibold text-lg mb-2">
									6-Pack Bootcamps
								</h3>
								<div className="price mb-4">
									£72<span>/6 sessions</span>
								</div>
								<ul className="space-y-3 text-sm text-gray-400 mb-6">
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Save £3 per session
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Commit to your goals
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Flexible scheduling
									</li>
								</ul>
								<Link
									href="/timetable"
									className="btn-lime w-full justify-center text-xs font-semibold tracking-widest uppercase">
									Get 6-Pack
								</Link>
							</div>
						</div>

						{/* Indoor Classes */}
						<div className="pricing-card">
							<div className="p-6">
								<h3 className="text-lime font-semibold text-lg mb-2">
									Indoor Classes
								</h3>
								<div className="price mb-4">
									£15<span>/session</span>
								</div>
								<ul className="space-y-3 text-sm text-gray-400 mb-6">
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Power Play & Lift and Shift
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Progressive training blocks
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="w-4 h-4 text-lime"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										6-pack: £84 (save £6)
									</li>
								</ul>
								<Link
									href="/timetable"
									className="btn-lime-outline w-full justify-center text-xs font-semibold tracking-widest uppercase">
									Book Now
								</Link>
							</div>
						</div>
					</div>

					{/* Mum Club callout */}
					<div className="mt-8 text-center">
						<p className="text-gray-400">
							<span className="text-lime font-semibold">Mum Club</span> - £10
							per session. A safe, supportive space for mums to move, sweat, and
							connect.
						</p>
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
						<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
							Real Results
						</h2>
					</div>

					{/* Testimonials grid */}
					<div className="grid md:grid-cols-2 gap-6">
						{/* Testimonial 1 - Sue Helen */}
						<div className="testimonial-card">
							<span className="quote-mark">&quot;</span>
							<p className="text-gray-300 leading-relaxed mb-6">
								Sue consistently showed up to her training sessions throughout
								her pregnancy. She hit a 95kg sumo deadlift PB at 8 months
								pregnant, returned to training just 2 months postpartum with no
								diastasis recti, and is now working toward her pre-pregnancy
								performance benchmarks.
							</p>
							<div className="testimonial-author">
								<div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center text-lime font-bold">
									SN
								</div>
								<div>
									<p className="text-white font-semibold">Sue Helen Nieto</p>
									<p className="text-gray-500 text-sm">
										Pregnancy & Postpartum Training
									</p>
								</div>
							</div>
						</div>

						{/* Testimonial 2 - Luke */}
						<div className="testimonial-card bg-[#222]">
							<span className="quote-mark">&quot;</span>
							<p className="text-gray-300 leading-relaxed mb-6">
								Luke started at 110kg with a goal to get below 85kg. Over 2
								years of twice-weekly strength training and cardio classes,
								he&apos;s lost 30kg, reduced body fat by 15.8%, and dropped his
								visceral fat score from 17 to 6. His confidence has grown
								immensely after completely transforming his lifestyle habits.
							</p>
							<div className="testimonial-author">
								<div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center text-lime font-bold">
									LR
								</div>
								<div>
									<p className="text-white font-semibold">Luke Rankin</p>
									<p className="text-gray-500 text-sm">
										30kg Weight Loss Transformation
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="text-center mt-10">
						<Link
							href="/results"
							className="btn-lime-outline text-xs font-semibold tracking-widest uppercase">
							View All Testimonials
						</Link>
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
						<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
							Our Classes
						</h2>
					</div>

					{/* Classes grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Power Play */}
						<div className="card-rounded-lg overflow-hidden group">
							<div className="p-6">
								<h3 className="text-white font-semibold text-lg mb-2">
									Power Play
								</h3>
								<p className="text-gray-500 text-sm">
									Move with intent. Full body movement patterns with speed and
									impetus to unlock your body&apos;s full potential.
								</p>
								<div className="divider-lime w-full mt-4"></div>
							</div>
						</div>

						{/* Lift & Shift */}
						<div className="card-rounded-lg overflow-hidden group">
							<div className="p-6">
								<h3 className="text-white font-semibold text-lg mb-2">
									Lift &amp; Shift
								</h3>
								<p className="text-gray-500 text-sm">
									Strength-focused compound movements with progressive training
									blocks and form-focused progressions.
								</p>
								<div className="divider-lime w-full mt-4"></div>
							</div>
						</div>

						{/* Engine Room */}
						<div className="card-rounded-lg overflow-hidden group">
							<div className="p-6">
								<h3 className="text-white font-semibold text-lg mb-2">
									Engine Room
								</h3>
								<p className="text-gray-500 text-sm">
									Build cardiovascular fitness and fatigue tolerance through
									high-intensity mixed modality workouts.
								</p>
								<div className="divider-lime w-full mt-4"></div>
							</div>
						</div>

						{/* Cardio Club */}
						<div className="card-rounded-lg overflow-hidden group">
							<div className="p-6">
								<h3 className="text-white font-semibold text-lg mb-2">
									Cardio Club
								</h3>
								<p className="text-gray-500 text-sm">
									Saturday group sessions. High intensity, lung busting workout
									in a supportive community environment.
								</p>
								<div className="divider-lime w-full mt-4"></div>
							</div>
						</div>

						{/* Mum Club */}
						<div className="card-rounded-lg overflow-hidden group">
							<div className="p-6">
								<h3 className="text-white font-semibold text-lg mb-2">
									Mum Club
								</h3>
								<p className="text-gray-500 text-sm">
									A safe, supportive, and energising space for mums to move,
									sweat, and connect. Focus on strength rebuilding.
								</p>
								<div className="divider-lime w-full mt-4"></div>
							</div>
						</div>

						{/* View All */}
						<Link
							href="/training"
							className="card-rounded-lg overflow-hidden group flex items-center justify-center p-6 border-2 border-dashed border-gray-700 hover:border-lime transition-colors">
							<div className="text-center">
								<span className="text-lime font-semibold">
									View All Classes
								</span>
								<svg
									className="w-5 h-5 text-lime mx-auto mt-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</div>
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
									Join Our WhatsApp Community
								</h2>
								<p className="text-gray-800 text-sm">
									Be the first to know about class schedules, special offers,
									and community events. Join the pack today!
								</p>
							</div>
							<div className="flex-1 max-w-md">
								<form
									className="flex flex-col sm:flex-row gap-3"
									suppressHydrationWarning>
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
											suppressHydrationWarning
										/>
									</div>
									<button
										type="submit"
										className="px-8 py-3 rounded-full font-semibold text-sm tracking-wider uppercase bg-black text-white hover:bg-gray-800 transition-colors"
										suppressHydrationWarning>
										Sign Up
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
