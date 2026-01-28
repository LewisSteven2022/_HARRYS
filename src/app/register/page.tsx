"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function RegisterForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get("redirect") || "/account";

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	// Check if Supabase is configured
	const supabaseReady = isSupabaseConfigured();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!supabaseReady) {
			setError("Authentication is not configured yet.");
			return;
		}
		setError("");
		setMessage("");
		setLoading(true);

		const supabase = createClient();

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					firstName,
					lastName,
					phone: phone || null,
				},
				emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
			},
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		setMessage("Check your email to confirm your account!");
		setLoading(false);
	};

	return (
		<div className="py-8 sm:py-12 md:py-16">
			<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-md">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-10 md:mb-12">
					<div className="flex items-center justify-center mb-2">
						<div className="triple-lines">
							<span></span>
						</div>
						<h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
							CREATE ACCOUNT
						</h1>
					</div>
					<p className="text-gray-400 text-sm sm:text-base px-4">
						Join Harry's PT to book and manage your sessions.
					</p>
				</div>

				<div className="bg-[#1a1a1a] rounded-lg p-5 sm:p-6 md:p-8">
					<form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-400 mb-2">
									First Name
								</label>
								<input
									type="text"
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
									className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
									placeholder="First name"
								/>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-400 mb-2">
									Last Name
								</label>
								<input
									type="text"
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
									className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
									placeholder="Last name"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-400 mb-2">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label
								htmlFor="phone"
								className="block text-sm font-medium text-gray-400 mb-2">
								Phone Number <span className="text-gray-600">(optional)</span>
							</label>
							<input
								type="tel"
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
								placeholder="Enter your phone number"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-400 mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
								className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
								placeholder="Create a password (min. 6 characters)"
							/>
						</div>

						{error && (
							<div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
								{error}
							</div>
						)}

						{message && (
							<div className="bg-lime/10 border border-lime/30 rounded-lg p-4 text-lime text-sm">
								{message}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full btn-lime text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed">
							{loading ? "Creating account..." : "Create Account"}
						</button>
					</form>
				</div>

				<p className="text-center text-gray-500 mt-8">
					Already have an account?{" "}
					<Link
						href={`/login${redirect !== "/account" ? `?redirect=${redirect}` : ""}`}
						className="text-lime hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

function RegisterLoading() {
	return (
		<div className="py-16">
			<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-md">
				<div className="animate-pulse">
					<div className="h-16 bg-gray-800 rounded w-64 mx-auto mb-8"></div>
					<div className="bg-[#1a1a1a] rounded-lg p-8 space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="h-12 bg-gray-800 rounded"></div>
							<div className="h-12 bg-gray-800 rounded"></div>
						</div>
						<div className="h-12 bg-gray-800 rounded"></div>
						<div className="h-12 bg-gray-800 rounded"></div>
						<div className="h-12 bg-gray-800 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function RegisterPage() {
	return (
		<Suspense fallback={<RegisterLoading />}>
			<RegisterForm />
		</Suspense>
	);
}
