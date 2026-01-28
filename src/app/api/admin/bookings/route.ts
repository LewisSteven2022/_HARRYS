import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const sessionId = searchParams.get("sessionId");
		const userEmail = searchParams.get("userEmail");
		const limit = parseInt(searchParams.get("limit") || "100");
		const offset = parseInt(searchParams.get("offset") || "0");

		const where: any = {};

		if (startDate || endDate) {
			where.date = {};
			if (startDate) {
				where.date.gte = new Date(startDate);
			}
			if (endDate) {
				where.date.lte = new Date(endDate);
			}
		}

		if (sessionId) {
			where.sessionId = sessionId;
		}

		if (userEmail) {
			where.OR = [
				{
					order: {
						user: {
							email: { contains: userEmail, mode: "insensitive" },
						},
					},
				},
				{
					creditUsage: {
						creditPurchase: {
							user: {
								email: { contains: userEmail, mode: "insensitive" },
							},
						},
					},
				},
			];
		}

		const bookings = await prisma.booking.findMany({
			where,
			take: limit,
			skip: offset,
			orderBy: { date: "desc" },
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

		const total = await prisma.booking.count({ where });

		return NextResponse.json({
			bookings: bookings.map((booking) => ({
				id: booking.id,
				date: booking.date.toISOString(),
				session: {
					id: booking.session.id,
					type: booking.session.sessionType.name,
					startTime: booking.session.startTime,
					endTime: booking.session.endTime,
				},
				user:
					booking.order?.user ?
						{
							id: booking.order.user.id,
							name:
								`${booking.order.user.firstName || ""} ${booking.order.user.lastName || ""}`.trim() ||
								booking.order.user.email,
							email: booking.order.user.email,
							phone: booking.order.user.phone,
						}
					: booking.creditUsage?.creditPurchase?.user ?
						{
							id: booking.creditUsage.creditPurchase.user.id,
							name:
								`${booking.creditUsage.creditPurchase.user.firstName || ""} ${booking.creditUsage.creditPurchase.user.lastName || ""}`.trim() ||
								booking.creditUsage.creditPurchase.user.email,
							email: booking.creditUsage.creditPurchase.user.email,
							phone: booking.creditUsage.creditPurchase.user.phone,
						}
					:	null,
				orderId: booking.orderId,
				paymentMethod: booking.orderId ? "order" : "credit",
				createdAt: booking.createdAt.toISOString(),
			})),
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Admin bookings GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 },
		);
	}
});
