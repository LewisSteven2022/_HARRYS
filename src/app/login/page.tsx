"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get("redirect") || "/account";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	// Check if Supabase is configured
	const supabaseReady = isSupabaseConfigured();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!supabaseReady) {
			setError("Authentication is not configured yet.");
			return;
		}
		setError("");
		setLoading(true);

		const supabase = createClient();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push(redirect);
		router.refresh();
	};

	const handleMagicLink = async () => {
		if (!supabaseReady) {
			setError("Authentication is not configured yet.");
			return;
		}
		if (!email) {
			setError("Please enter your email address");
			return;
		}

		setError("");
		setMessage("");
		setLoading(true);

		const supabase = createClient();

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
			},
		});

		if (error) {
			setError(error.message);
		} else {
			setMessage("Check your email for the login link!");
		}
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
							SIGN IN
						</h1>
					</div>
					<p className="text-gray-400 text-sm sm:text-base px-4">
						Welcome back! Sign in to manage your bookings.
					</p>
				</div>

				<div className="bg-[#1a1a1a] rounded-lg p-5 sm:p-6 md:p-8">
					<form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
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
								className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-lime focus:outline-none transition-colors"
								placeholder="Enter your password"
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
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					<div className="relative my-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-800"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-[#1a1a1a] text-gray-500">or</span>
						</div>
					</div>

					<button
						onClick={handleMagicLink}
						disabled={loading}
						className="w-full btn-secondary text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed">
						Send Magic Link
					</button>

					<p className="text-gray-600 text-xs text-center mt-4">
						We'll email you a link to sign in without a password.
					</p>
				</div>

				<p className="text-center text-gray-500 mt-8">
					Don't have an account?{" "}
					<Link
						href={`/register${redirect !== "/account" ? `?redirect=${redirect}` : ""}`}
						className="text-lime hover:underline">
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}

function LoginLoading() {
	return (
		<div className="py-16">
			<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-md">
				<div className="animate-pulse">
					<div className="h-16 bg-gray-800 rounded w-48 mx-auto mb-8"></div>
					<div className="bg-[#1a1a1a] rounded-lg p-8 space-y-6">
						<div className="h-12 bg-gray-800 rounded"></div>
						<div className="h-12 bg-gray-800 rounded"></div>
						<div className="h-12 bg-gray-800 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<LoginLoading />}>
			<LoginForm />
		</Suspense>
	);
}
