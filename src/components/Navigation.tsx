"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BasketIcon from "./BasketIcon";
import BasketDrawer from "./BasketDrawer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [basketOpen, setBasketOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [mobileMenuOpen]);

	// Check if user is logged in (non-blocking)
	useEffect(() => {
		if (!isSupabaseConfigured()) {
			setIsLoggedIn(false);
			return;
		}

		let mounted = true;
		let subscription: { unsubscribe: () => void } | null = null;

		// Initialize auth check asynchronously without blocking render
		const initAuth = async () => {
			try {
				const supabase = createClient();

				// Get session (reads from localStorage/cookies - fast)
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (mounted) {
					setIsLoggedIn(!!session?.user);
				}

				// Listen for auth state changes
				const {
					data: { subscription: sub },
				} = supabase.auth.onAuthStateChange((_event, session) => {
					if (mounted) {
						setIsLoggedIn(!!session?.user);
					}
				});
				subscription = sub;
			} catch {
				if (mounted) {
					setIsLoggedIn(false);
				}
			}
		};

		// Don't await - let it run in background
		initAuth();

		return () => {
			mounted = false;
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, []);

	// Handle sign out
	const handleSignOut = async () => {
		if (!isSupabaseConfigured()) {
			router.push("/");
			return;
		}
		const supabase = createClient();
		await supabase.auth.signOut();
		setMobileMenuOpen(false);
		router.push("/");
		router.refresh();
	};

	return (
		<>
			<nav
				id="navbar"
				className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-900/50">
				<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
					<div className="flex items-center justify-between h-16 sm:h-20">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/images/logo.png"
								alt="Harry's JSY"
								width={120}
								height={48}
								className="h-12 sm:h-10 w-auto"
								priority
							/>
						</Link>

						<div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10 mx-8">
							<Link
								href="/training"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Classes
							</Link>
							<Link
								href="/timetable"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Schedule
							</Link>
							<Link
								href="/results"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Testimonials
							</Link>
							<Link
								href="/coach"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Meet Harry
							</Link>
							<Link
								href="/contact"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Contact
							</Link>
						</div>

						<div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
							<Link
								href="/account"
								className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap">
								Account
							</Link>
							{isLoggedIn && (
								<button
									onClick={handleSignOut}
									className="text-xs font-medium tracking-widest text-gray-400 hover:text-red-400 transition-colors uppercase whitespace-nowrap">
									Sign Out
								</button>
							)}
							<BasketIcon onClick={() => setBasketOpen(true)} />
							{!isLoggedIn && (
								<Link
									href="/timetable"
									className="btn-lime text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
									Join the Pack
								</Link>
							)}
						</div>

						<div className="flex items-center gap-2 lg:hidden">
							<BasketIcon onClick={() => setBasketOpen(true)} />
							<button
								id="mobile-menu-btn"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="text-white p-2">
								<div className="space-y-1.5">
									<span
										className={`block w-6 h-0.5 bg-white transition-all hamburger-line-1 ${
											mobileMenuOpen ? "rotate-45 translate-y-2" : ""
										}`}></span>
									<span
										className={`block w-6 h-0.5 bg-white transition-all hamburger-line-2 ${
											mobileMenuOpen ? "opacity-0" : ""
										}`}></span>
									<span
										className={`block w-6 h-0.5 bg-white transition-all hamburger-line-3 ${
											mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
										}`}></span>
								</div>
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Backdrop */}
			{mobileMenuOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black z-[60]"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}

			{/* Mobile Menu */}
			<div
				id="mobile-menu"
				className={`lg:hidden fixed inset-0 bg-black z-70 transform transition-transform ${
					mobileMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-900">
						<h2 className="font-display text-xl text-white tracking-wide">
							MENU
						</h2>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className="p-2 text-gray-400 hover:text-white transition-colors">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Menu Items */}
					<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
						<Link
							href="/training"
							className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
							onClick={() => setMobileMenuOpen(false)}>
							Classes
						</Link>
						<Link
							href="/timetable"
							className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
							onClick={() => setMobileMenuOpen(false)}>
							Schedule
						</Link>
						<Link
							href="/results"
							className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
							onClick={() => setMobileMenuOpen(false)}>
							Testimonials
						</Link>
						<Link
							href="/coach"
							className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
							onClick={() => setMobileMenuOpen(false)}>
							Meet Harry
						</Link>
						<Link
							href="/contact"
							className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
							onClick={() => setMobileMenuOpen(false)}>
							Contact
						</Link>
						<div className="pt-4 border-t border-gray-900">
							{isLoggedIn && (
								<Link
									href="/account"
									className="block text-center text-base font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase mb-4"
									onClick={() => setMobileMenuOpen(false)}>
									Account
								</Link>
							)}
							<Link
								href="/admin"
								className="block text-center text-base font-medium tracking-widest text-lime hover:text-lime-dark transition-colors uppercase mb-4"
								onClick={() => setMobileMenuOpen(false)}>
								Admin
							</Link>
							{isLoggedIn && (
								<button
									onClick={handleSignOut}
									className="block w-full text-center text-base font-medium tracking-widest text-gray-500 hover:text-red-400 transition-colors uppercase mb-6">
									Sign Out
								</button>
							)}
							{!isLoggedIn && (
								<div className="flex justify-center">
									<Link
										href="/timetable"
										className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase"
										onClick={() => setMobileMenuOpen(false)}>
										Join the Pack
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<BasketDrawer isOpen={basketOpen} onClose={() => setBasketOpen(false)} />
		</>
	);
}
