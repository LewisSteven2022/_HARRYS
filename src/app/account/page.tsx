import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { prisma } from "@/lib/prisma";
import CreditBalanceCard from "./CreditBalanceCard";

// Helper to format date
function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
	}).format(date);
}

// Helper to format time
function formatTime(time: string): string {
	return time;
}

// Day names for display
const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export default async function AccountPage() {
	// If Supabase isn't configured, show setup message
	if (!isSupabaseConfigured()) {
		return (
			<div className="py-16">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl text-center">
					<h1 className="font-display text-5xl text-white tracking-wide mb-4">
						AUTH NOT CONFIGURED
					</h1>
					<p className="text-gray-400 mb-8">
						Supabase authentication is not yet configured. Please set up your
						environment variables.
					</p>
					<Link
						href="/"
						className="btn-lime text-sm font-semibold tracking-widest uppercase">
						Back to Home
					</Link>
				</div>
			</div>
		);
	}

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase!.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user profile from Prisma for name
	const prismaUser = await prisma.user.findUnique({
		where: { email: user.email! },
	});

	// Use Prisma user name first, then Supabase metadata, then email fallback
	const firstName =
		prismaUser?.firstName || user.user_metadata?.firstName || "";
	const lastName = prismaUser?.lastName || user.user_metadata?.lastName || "";
	const userName =
		firstName && lastName ?
			`${firstName} ${lastName}`
		:	firstName || lastName || user.email?.split("@")[0] || "User";

	// Fetch upcoming bookings (both paid orders and credit-based)
	const now = new Date();
	const upcomingBookings = await prisma.booking.findMany({
		where: {
			date: { gte: now },
			OR: [
				// Bookings from paid orders
				{
					order: {
						userId: user.id,
						status: "PAID",
					},
				},
				// Credit-based bookings (no order, linked via creditUsage)
				{
					orderId: null,
					creditUsage: {
						creditPurchase: {
							userId: prismaUser?.id || user.id,
						},
					},
				},
			],
		},
		include: {
			session: {
				include: { sessionType: true },
			},
		},
		orderBy: { date: "asc" },
		take: 5,
	});

	// Fetch credit balance
	// Use Prisma user ID if available, otherwise fall back to Supabase user ID
	const userIdForCredits = prismaUser?.id || user.id;
	const creditPurchases = await prisma.creditPurchase.findMany({
		where: {
			userId: userIdForCredits,
			creditsRemaining: { gt: 0 },
			expiresAt: { gt: now },
		},
		include: {
			package: true,
		},
		orderBy: { expiresAt: "asc" },
	});

	const totalCredits = creditPurchases.reduce(
		(sum, p) => sum + p.creditsRemaining,
		0,
	);

	// Find credits expiring within 30 days
	const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
	const expiringCredits = creditPurchases
		.filter((p) => p.expiresAt <= thirtyDaysFromNow)
		.reduce((sum, p) => sum + p.creditsRemaining, 0);
	const earliestExpiration = creditPurchases.find(
		(p) => p.expiresAt <= thirtyDaysFromNow,
	)?.expiresAt;

	// Fetch order history
	const orders = await prisma.order.findMany({
		where: { userId: user.id },
		include: {
			bookings: {
				include: {
					session: { include: { sessionType: true } },
				},
			},
		},
		orderBy: { createdAt: "desc" },
		take: 10,
	});

	return (
		<div className="py-16">
			<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
				{/* Header */}
				<div className="mb-12">
					<div className="flex items-center mb-2">
						<div className="triple-lines">
							<span></span>
						</div>
						<h1 className="font-display text-5xl text-white tracking-wide">
							MY ACCOUNT
						</h1>
					</div>
					<p className="text-gray-400">Welcome back, {userName}!</p>
				</div>

				{/* Credit Balance Card */}
				<CreditBalanceCard
					totalCredits={totalCredits}
					expiringCredits={expiringCredits}
					earliestExpiration={earliestExpiration}
					creditPurchases={creditPurchases.map((p) => ({
						id: p.id,
						packageName: p.package.name,
						creditsRemaining: p.creditsRemaining,
						expiresAt: p.expiresAt.toISOString(),
					}))}
				/>

				<div className="grid md:grid-cols-3 gap-8">
					{/* Profile Card */}
					<div className="bg-[#1a1a1a] rounded-lg p-6">
						<h2 className="font-display text-xl text-white tracking-wide mb-4">
							PROFILE
						</h2>
						<div className="space-y-3">
							<div>
								<p className="text-gray-500 text-sm">Name</p>
								<p className="text-white">{userName}</p>
							</div>
							<div>
								<p className="text-gray-500 text-sm">Email</p>
								<p className="text-white text-sm">{user.email}</p>
							</div>
						</div>
						<div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
							<Link
								href="/account/profile"
								className="block text-center text-lime text-sm hover:underline">
								Edit Profile
							</Link>
							<SignOutButton />
						</div>
					</div>

					{/* Fitness Tracking */}
					<div className="bg-[#1a1a1a] rounded-lg p-6">
						<h2 className="font-display text-xl text-white tracking-wide mb-4">
							FITNESS TRACKING
						</h2>
						<div className="space-y-3">
							<Link
								href="/account/stats"
								className="block w-full text-left p-3 rounded-lg bg-[#0a0a0a] hover:bg-lime/10 border border-gray-800 hover:border-lime/30 transition-colors">
								<p className="text-white font-medium">Body Stats</p>
								<p className="text-gray-500 text-sm">
									Track measurements & activity
								</p>
							</Link>
							<Link
								href="/account/workouts"
								className="block w-full text-left p-3 rounded-lg bg-[#0a0a0a] hover:bg-lime/10 border border-gray-800 hover:border-lime/30 transition-colors">
								<p className="text-white font-medium">Workout Log</p>
								<p className="text-gray-500 text-sm">
									Log exercises & progress
								</p>
							</Link>
							<Link
								href="/timetable"
								className="block w-full text-left p-3 rounded-lg bg-[#0a0a0a] hover:bg-lime/10 border border-gray-800 hover:border-lime/30 transition-colors">
								<p className="text-white font-medium">Book Sessions</p>
								<p className="text-gray-500 text-sm">View schedule and book</p>
							</Link>
						</div>
					</div>

					{/* Upcoming Sessions */}
					<div className="bg-[#1a1a1a] rounded-lg p-6">
						<h2 className="font-display text-xl text-white tracking-wide mb-4">
							UPCOMING SESSIONS
						</h2>
						{upcomingBookings.length > 0 ?
							<div className="space-y-3">
								{upcomingBookings.map((booking) => (
									<div
										key={booking.id}
										className="p-3 rounded-lg bg-[#0a0a0a] border border-gray-800">
										<p className="text-lime font-medium text-sm">
											{booking.session.sessionType.name}
										</p>
										<p className="text-white">{formatDate(booking.date)}</p>
										<p className="text-gray-500 text-sm">
											{formatTime(booking.session.startTime)} -{" "}
											{formatTime(booking.session.endTime)}
										</p>
									</div>
								))}
								{upcomingBookings.length >= 5 && (
									<p className="text-gray-500 text-sm text-center pt-2">
										Showing next 5 sessions
									</p>
								)}
							</div>
						:	<div className="text-center py-8">
								<svg
									className="w-12 h-12 mx-auto text-gray-700 mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<p className="text-gray-500 text-sm">No upcoming sessions</p>
								<Link
									href="/timetable"
									className="inline-block mt-4 text-lime text-sm hover:underline">
									Book your first session
								</Link>
							</div>
						}
					</div>
				</div>

				{/* Order History */}
				<div className="mt-8 bg-[#1a1a1a] rounded-lg p-6">
					<h2 className="font-display text-xl text-white tracking-wide mb-6">
						ORDER HISTORY
					</h2>
					{orders.length > 0 ?
						<div className="space-y-4">
							{orders.map((order) => (
								<div
									key={order.id}
									className="p-4 rounded-lg bg-[#0a0a0a] border border-gray-800">
									<div className="flex justify-between items-start mb-3">
										<div>
											<p className="text-white font-medium">
												Order #{order.sumupReference.slice(-8).toUpperCase()}
											</p>
											<p className="text-gray-500 text-sm">
												{new Intl.DateTimeFormat("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												}).format(order.createdAt)}
											</p>
										</div>
										<div className="text-right">
											<p className="text-white font-medium">
												£{Number(order.totalAmount).toFixed(2)}
											</p>
											<span
												className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
													order.status === "PAID" ?
														"bg-green-900/30 text-green-400"
													: order.status === "PENDING" ?
														"bg-yellow-900/30 text-yellow-400"
													:	"bg-red-900/30 text-red-400"
												}`}>
												{order.status}
											</span>
										</div>
									</div>
									{order.bookings.length > 0 && (
										<div className="border-t border-gray-800 pt-3 mt-3">
											<p className="text-gray-500 text-xs uppercase mb-2">
												Sessions
											</p>
											<div className="space-y-1">
												{order.bookings.map((booking) => (
													<div
														key={booking.id}
														className="flex justify-between text-sm">
														<span className="text-gray-400">
															{booking.session.sessionType.name}
														</span>
														<span className="text-gray-500">
															{formatDate(booking.date)} at{" "}
															{formatTime(booking.session.startTime)}
														</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					:	<div className="text-center py-12">
							<svg
								className="w-16 h-16 mx-auto text-gray-700 mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<p className="text-gray-500">No orders yet</p>
							<p className="text-gray-600 text-sm mt-2">
								Your booking history will appear here
							</p>
						</div>
					}
				</div>
			</div>
		</div>
	);
}
