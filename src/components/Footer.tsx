"use client";

import Link from "next/link";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer-dark mt-8">
			<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl py-6 sm:py-8 lg:py-6">
				<div className="pt-6 border-t border-gray-800">
					<div className="flex flex-col gap-4 sm:gap-6">
						{/* Links */}
						<div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
							<Link href="/" className="footer-link">
								Home
							</Link>
							<Link href="/coach" className="footer-link">
								Meet Harry
							</Link>
							<Link href="/training" className="footer-link">
								Classes
							</Link>
							<Link href="/results" className="footer-link">
								Testimonials
							</Link>
							<Link href="/timetable" className="footer-link">
								Schedule
							</Link>
							<Link href="/account" className="footer-link">
								My Account
							</Link>
							<Link href="/contact" className="footer-link">
								Contact Us
							</Link>
							<a href="tel:+447797896061" className="footer-link">
								07797 896061
							</a>
							<a
								href="https://instagram.com/harrysjsy"
								target="_blank"
								rel="noopener noreferrer"
								className="footer-link text-lime">
								@harrysjsy
							</a>
							<a
								href="https://instagram.com/harrysjsy"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex w-8 h-8 rounded-full bg-gray-800 items-center justify-center text-gray-400 hover:bg-lime hover:text-black transition-colors">
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
								</svg>
							</a>
						</div>

						{/* Copyright and Legal */}
						<div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
							<p className="text-gray-600 text-xs text-center sm:text-left">
								&copy; {currentYear} Harry&apos;s JSY. All rights reserved.
							</p>
							<div className="flex gap-4 sm:gap-6 text-xs">
								<a
									href="#"
									className="text-gray-600 hover:text-lime transition-colors">
									Privacy Policy
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-lime transition-colors">
									Terms & Conditions
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
