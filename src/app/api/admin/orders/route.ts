import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const userEmail = searchParams.get("userEmail");
		const limit = parseInt(searchParams.get("limit") || "50");
		const offset = parseInt(searchParams.get("offset") || "0");

		const where: any = {};

		if (status) {
			where.status = status;
		}

		if (startDate || endDate) {
			where.createdAt = {};
			if (startDate) {
				where.createdAt.gte = new Date(startDate);
			}
			if (endDate) {
				where.createdAt.lte = new Date(endDate);
			}
		}

		if (userEmail) {
			where.user = {
				email: { contains: userEmail, mode: "insensitive" },
			};
		}

		const orders = await prisma.order.findMany({
			where,
			take: limit,
			skip: offset,
			orderBy: { createdAt: "desc" },
			include: {
				user: true,
				bookings: {
					include: {
						session: {
							include: {
								sessionType: true,
							},
						},
					},
				},
				orderItems: {
					include: {
						session: {
							include: {
								sessionType: true,
							},
						},
					},
				},
				creditPackage: true,
			},
		});

		const total = await prisma.order.count({ where });

		return NextResponse.json({
			orders: orders.map((order) => ({
				id: order.id,
				sumupReference: order.sumupReference,
				status: order.status,
				totalAmount: Number(order.totalAmount),
				currency: order.currency,
				user:
					order.user ?
						{
							id: order.user.id,
							name:
								`${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
								order.user.email,
							email: order.user.email,
						}
					:	{
							name: order.guestName,
							email: order.guestEmail,
						},
				creditPackage:
					order.creditPackage ?
						{
							name: order.creditPackage.name,
							sessionCount: order.creditPackage.sessionCount,
						}
					:	null,
				bookings: order.bookings.map((booking) => ({
					id: booking.id,
					date: booking.date.toISOString(),
					sessionType: booking.session.sessionType.name,
					startTime: booking.session.startTime,
					endTime: booking.session.endTime,
				})),
				orderItems: order.orderItems.map((item) => ({
					id: item.id,
					sessionDate: item.sessionDate.toISOString(),
					price: Number(item.price),
					sessionType: item.session.sessionType.name,
				})),
				createdAt: order.createdAt.toISOString(),
				paidAt: order.paidAt?.toISOString(),
			})),
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Admin orders GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch orders" },
			{ status: 500 },
		);
	}
});
