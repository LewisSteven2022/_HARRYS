import { createClient } from "@/lib/supabase/server";
import { getAdminStatus } from "@/lib/admin";
import Link from "next/link";

async function getStats() {
	try {
		const { prisma } = await import("@/lib/prisma");
		const now = new Date();
		const startOfToday = new Date(now.setHours(0, 0, 0, 0));
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const totalSessions = await prisma.session.count();
		const upcomingBookings = await prisma.booking.count({
			where: { date: { gte: startOfToday } },
		});
		const totalUsers = await prisma.user.count();

		const recentOrders = await prisma.order.findMany({
			where: {
				status: "PAID",
				paidAt: { gte: thirtyDaysAgo },
			},
			select: { totalAmount: true },
		});
		const revenue = recentOrders.reduce(
			(sum, order) => sum + Number(order.totalAmount),
			0,
		);

		const allTimeOrders = await prisma.order.findMany({
			where: { status: "PAID" },
			select: { totalAmount: true },
		});
		const totalRevenue = allTimeOrders.reduce(
			(sum, order) => sum + Number(order.totalAmount),
			0,
		);

		const recentBookings = await prisma.booking.findMany({
			take: 10,
			orderBy: { createdAt: "desc" },
			include: {
				session: { include: { sessionType: true } },
				order: { include: { user: true } },
				creditUsage: {
					include: {
						creditPurchase: { include: { user: true } },
					},
				},
			},
		});

		return {
			totalSessions,
			upcomingBookings,
			totalUsers,
			revenue: { last30Days: revenue, allTime: totalRevenue },
			recentBookings: recentBookings.map((booking) => ({
				id: booking.id,
				date: booking.date.toISOString(),
				sessionType: booking.session.sessionType.name,
				startTime: booking.session.startTime,
				endTime: booking.session.endTime,
				user:
					booking.order?.user ?
						{
							name:
								`${booking.order.user.firstName || ""} ${booking.order.user.lastName || ""}`.trim() ||
								booking.order.user.email,
							email: booking.order.user.email,
						}
					: booking.creditUsage?.creditPurchase?.user ?
						{
							name:
								`${booking.creditUsage.creditPurchase.user.firstName || ""} ${booking.creditUsage.creditPurchase.user.lastName || ""}`.trim() ||
								booking.creditUsage.creditPurchase.user.email,
							email: booking.creditUsage.creditPurchase.user.email,
						}
					:	null,
				createdAt: booking.createdAt.toISOString(),
			})),
		};
	} catch (error) {
		console.error("Error fetching stats:", error);
		return null;
	}
}

export default async function AdminDashboard() {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	const stats = await getStats();

	return (
		<div className="space-y-4 sm:space-y-6 lg:space-y-8">
			{/* Header */}
			<div>
				<h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-wide mb-2">
					Admin Dashboard
				</h1>
				<p className="text-gray-400 text-sm sm:text-base">
					Manage your site and view analytics
				</p>
			</div>

			{/* Stats Grid */}
			{stats && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
					<div className="card-rounded-lg p-4 sm:p-6">
						<div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
							Total Sessions
						</div>
						<div className="text-2xl sm:text-3xl font-bold text-white">
							{stats.totalSessions}
						</div>
					</div>

					<div className="card-rounded-lg p-4 sm:p-6">
						<div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
							Upcoming Bookings
						</div>
						<div className="text-2xl sm:text-3xl font-bold text-white">
							{stats.upcomingBookings}
						</div>
					</div>

					<div className="card-rounded-lg p-4 sm:p-6">
						<div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
							Total Users
						</div>
						<div className="text-2xl sm:text-3xl font-bold text-white">
							{stats.totalUsers}
						</div>
					</div>

					<div className="card-rounded-lg p-4 sm:p-6">
						<div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
							Revenue (30 days)
						</div>
						<div className="text-2xl sm:text-3xl font-bold text-lime">
							£{stats.revenue.last30Days.toFixed(2)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							Total: £{stats.revenue.allTime.toFixed(2)}
						</div>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="card-rounded-lg p-4 sm:p-6">
				<h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
					<Link
						href="/admin/sessions"
						className="p-3 sm:p-4 border border-gray-700 rounded-lg hover:border-lime transition-colors">
						<div className="text-lime text-xl sm:text-2xl mb-2">📅</div>
						<div className="text-white font-medium mb-1 text-sm sm:text-base">
							Manage Sessions
						</div>
						<div className="text-gray-400 text-xs sm:text-sm">
							Add, edit, or remove sessions
						</div>
					</Link>

					<Link
						href="/admin/bookings"
						className="p-3 sm:p-4 border border-gray-700 rounded-lg hover:border-lime transition-colors">
						<div className="text-lime text-xl sm:text-2xl mb-2">🎫</div>
						<div className="text-white font-medium mb-1 text-sm sm:text-base">
							View Bookings
						</div>
						<div className="text-gray-400 text-xs sm:text-sm">
							Manage customer bookings
						</div>
					</Link>

					<Link
						href="/admin/users"
						className="p-3 sm:p-4 border border-gray-700 rounded-lg hover:border-lime transition-colors">
						<div className="text-lime text-xl sm:text-2xl mb-2">👥</div>
						<div className="text-white font-medium mb-1 text-sm sm:text-base">
							Manage Users
						</div>
						<div className="text-gray-400 text-xs sm:text-sm">
							View and manage user accounts
						</div>
					</Link>
				</div>
			</div>

			{/* Recent Bookings */}
			{stats && stats.recentBookings && stats.recentBookings.length > 0 && (
				<div className="card-rounded-lg p-4 sm:p-6">
					<h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
						Recent Bookings
					</h2>
					{/* Mobile: Card View */}
					<div className="lg:hidden space-y-3">
						{stats.recentBookings.map((booking: any) => (
							<div
								key={booking.id}
								className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
								<div className="flex items-start justify-between mb-2">
									<div className="text-white text-sm font-medium">
										{booking.sessionType}
									</div>
									<div className="text-gray-400 text-xs">
										{new Date(booking.date).toLocaleDateString()}
									</div>
								</div>
								<div className="text-gray-400 text-xs mb-1">
									{booking.startTime} - {booking.endTime}
								</div>
								<div className="text-gray-500 text-xs">
									{booking.user?.name || booking.user?.email || "N/A"}
								</div>
							</div>
						))}
					</div>
					{/* Desktop: Table View */}
					<div className="hidden lg:block overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-800">
									<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
										Date
									</th>
									<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
										Session
									</th>
									<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
										Time
									</th>
									<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
										User
									</th>
								</tr>
							</thead>
							<tbody>
								{stats.recentBookings.map((booking: any) => (
									<tr
										key={booking.id}
										className="border-b border-gray-900 hover:bg-gray-900/50">
										<td className="py-3 px-4 text-white text-sm">
											{new Date(booking.date).toLocaleDateString()}
										</td>
										<td className="py-3 px-4 text-white text-sm">
											{booking.sessionType}
										</td>
										<td className="py-3 px-4 text-gray-400 text-sm">
											{booking.startTime} - {booking.endTime}
										</td>
										<td className="py-3 px-4 text-gray-400 text-sm">
											{booking.user?.name || booking.user?.email || "N/A"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
