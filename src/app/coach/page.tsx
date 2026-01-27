import Image from "next/image";
import Link from "next/link";

export default function Coach() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative min-h-[80vh] flex items-center overflow-hidden">
				<div className="absolute inset-0 z-0">
					<div className="rounded-full absolute inset-0 bg-opacity-100 z10"></div>
					<Image
						src="/images/harry-2.jpeg"
						alt="Harry - Founder of Harry's JSY"
						fill
						className="w-full h-full object-cover object-top brightness-100"
						style={{ objectPosition: "center 8%" }}
						priority
					/>
				</div>

				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl relative z-10 py-20">
					<p className="accent-script text-xl md:text-2xl mb-2">
						Meet the Founder
					</p>
					<h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wide mb-4">
						HARRY
					</h1>
					<p className="text-lime text-lg md:text-xl font-semibold">
						Founder & Director, Harry&apos;s JSY
					</p>
				</div>
			</section>

			{/* Bio Section */}
			<section className="section-padding-lg">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
					<div className="grid lg:grid-cols-2 gap-12 items-start">
						{/* Left - Main Bio */}
						<div>
							<div className="flex items-center mb-8">
								<div className="triple-lines">
									<span></span>
								</div>
								<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
									The Journey
								</h2>
							</div>

							<div className="space-y-6 text-gray-300 leading-relaxed">
								<p className="text-lg">
									After 8 years as a professional rugby player and Head Coach at
									Asia&apos;s Flagship gym, I&apos;m returning home to Jersey to
									help people move better, get fitter, and build the ultimate
									fitness community.
								</p>

								<p>
									With a background in sports science and performance training,
									I specialise in outdoor functional fitness for all levels –
									whether you&apos;re just starting or chasing personal bests.
								</p>

								<p>
									My journey has taken me from the rugby fields of Hartpury
									College and Worcester Warriors, through corporate fitness in
									Cheltenham, to leading training at UFIT in Singapore. Now
									I&apos;m bringing everything I&apos;ve learned back to Jersey.
								</p>

								<blockquote className="border-l-4 border-lime pl-6 py-2 my-8 text-xl italic text-gray-200">
									&quot;Don&apos;t ever underestimate the correlation between
									healthy fitness habits, career success and family life
									accountability.&quot;
								</blockquote>

								<p>
									At Harry&apos;s, our core value is creating an environment
									where you do it with a smile on your face and enjoy it.
									Impeccable coaching standards, relentless energy and
									enthusiasm, and an empowering community for like-minded
									individuals prioritizing health and fitness.
								</p>
							</div>
						</div>

						{/* Right - Credentials & Image */}
						<div>
							<div className="card-rounded-lg p-8 mb-8">
								<h3 className="font-display text-2xl text-white mb-6 tracking-wide">
									Credentials
								</h3>

								<div className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-6 h-6 text-lime"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
												/>
											</svg>
										</div>
										<div>
											<p className="text-white font-semibold">
												BSc Sports Performance
											</p>
											<p className="text-gray-400 text-sm">
												Academic Foundation
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-6 h-6 text-lime"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
										</div>
										<div>
											<p className="text-white font-semibold">
												Hyrox Pro Doubles Singapore Champion
											</p>
											<p className="text-gray-400 text-sm">
												59 minutes finish time
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-6 h-6 text-lime"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
										</div>
										<div>
											<p className="text-white font-semibold">
												Turf Games Singapore ELITE Champion
											</p>
											<p className="text-gray-400 text-sm">
												Asia&apos;s premier functional fitness competition
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="card-rounded-lg p-8">
								<h3 className="font-display text-2xl text-white mb-6 tracking-wide">
									Experience
								</h3>

								<div className="space-y-6">
									<div className="border-l-2 border-lime pl-4">
										<p className="text-lime text-sm font-semibold">14+ Years</p>
										<p className="text-white font-semibold">
											Health & Fitness Industry
										</p>
									</div>

									<div className="border-l-2 border-gray-700 pl-4">
										<p className="text-gray-500 text-sm">Professional Rugby</p>
										<p className="text-white font-semibold">
											Hartpury College, Worcester Warriors, England Students
										</p>
									</div>

									<div className="border-l-2 border-gray-700 pl-4">
										<p className="text-gray-500 text-sm">Director</p>
										<p className="text-white font-semibold">
											Huddle Fitness Cheltenham
										</p>
									</div>

									<div className="border-l-2 border-gray-700 pl-4">
										<p className="text-gray-500 text-sm">Head Coach</p>
										<p className="text-white font-semibold">
											UFIT Singapore (Asia&apos;s Flagship Gym)
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Philosophy Section */}
			<section className="section-padding-lg bg-[#111111]">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
					<div className="flex items-center mb-12">
						<div className="triple-lines">
							<span></span>
						</div>
						<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
							My Philosophy
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-lime"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-white font-semibold text-lg mb-2">
								Community First
							</h3>
							<p className="text-gray-400 text-sm">
								Building an empowering community for like-minded individuals
								prioritizing health and fitness.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-lime"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-white font-semibold text-lg mb-2">
								Impeccable Standards
							</h3>
							<p className="text-gray-400 text-sm">
								Every session delivered with the highest coaching standards and
								attention to form.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-lime"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-white font-semibold text-lg mb-2">
								Enjoy the Journey
							</h3>
							<p className="text-gray-400 text-sm">
								Do it with a smile on your face. Training should be challenging
								but enjoyable.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="section-padding-lg">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl text-center">
					<h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-6">
						Ready to Join the Pack?
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto mb-8">
						Whether you&apos;re just starting your fitness journey or looking to
						take it to the next level, I&apos;m here to help you achieve your
						goals.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href="/timetable"
							className="btn-lime text-sm font-semibold tracking-widest uppercase">
							View Schedule
						</Link>
						<Link
							href="/contact"
							className="btn-lime-outline text-sm font-semibold tracking-widest uppercase">
							Get in Touch
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
