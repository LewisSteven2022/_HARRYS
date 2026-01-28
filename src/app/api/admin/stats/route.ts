import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		const now = new Date();
		const startOfToday = new Date(now.setHours(0, 0, 0, 0));
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// Get total sessions
		const totalSessions = await prisma.session.count();

		// Get upcoming bookings count
		const upcomingBookings = await prisma.booking.count({
			where: {
				date: { gte: startOfToday },
			},
		});

		// Get total users
		const totalUsers = await prisma.user.count();

		// Get revenue from paid orders (last 30 days)
		const recentOrders = await prisma.order.findMany({
			where: {
				status: "PAID",
				paidAt: { gte: thirtyDaysAgo },
			},
			select: {
				totalAmount: true,
			},
		});

		const revenue = recentOrders.reduce(
			(sum, order) => sum + Number(order.totalAmount),
			0,
		);

		// Get total revenue (all time)
		const allTimeOrders = await prisma.order.findMany({
			where: {
				status: "PAID",
			},
			select: {
				totalAmount: true,
			},
		});

		const totalRevenue = allTimeOrders.reduce(
			(sum, order) => sum + Number(order.totalAmount),
			0,
		);

		// Get recent bookings (last 10)
		const recentBookings = await prisma.booking.findMany({
			take: 10,
			orderBy: { createdAt: "desc" },
			include: {
				session: {
					include: {
						sessionType: true,
					},
				},
				order: {
					include: {
						user: true,
					},
				},
				creditUsage: {
					include: {
						creditPurchase: {
							include: {
								user: true,
							},
						},
					},
				},
			},
		});

		// Get active bookings today
		const bookingsToday = await prisma.booking.count({
			where: {
				date: {
					gte: startOfToday,
					lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
				},
			},
		});

		return NextResponse.json({
			totalSessions,
			upcomingBookings,
			totalUsers,
			revenue: {
				last30Days: revenue,
				allTime: totalRevenue,
			},
			bookingsToday,
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
		});
	} catch (error) {
		console.error("Admin stats API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 },
		);
	}
});
