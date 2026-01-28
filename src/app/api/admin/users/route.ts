import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search");
		const limit = parseInt(searchParams.get("limit") || "50");
		const offset = parseInt(searchParams.get("offset") || "0");

		const where: any = {};

		if (search) {
			where.OR = [
				{ email: { contains: search, mode: "insensitive" } },
				{ firstName: { contains: search, mode: "insensitive" } },
				{ lastName: { contains: search, mode: "insensitive" } },
			];
		}

		const users = await prisma.user.findMany({
			where,
			take: limit,
			skip: offset,
			orderBy: { createdAt: "desc" },
			include: {
				_count: {
					select: {
						orders: true,
						creditPurchases: true,
					},
				},
			},
		});

		// Get booking counts for each user
		const usersWithBookings = await Promise.all(
			users.map(async (user) => {
				const bookingCount = await prisma.booking.count({
					where: {
						OR: [
							{ order: { userId: user.id } },
							{
								creditUsage: {
									creditPurchase: { userId: user.id },
								},
							},
						],
					},
				});

				return {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					phone: user.phone,
					isAdmin: user.isAdmin,
					createdAt: user.createdAt.toISOString(),
					updatedAt: user.updatedAt.toISOString(),
					stats: {
						orders: user._count.orders,
						creditPurchases: user._count.creditPurchases,
						bookings: bookingCount,
					},
				};
			}),
		);

		const total = await prisma.user.count({ where });

		return NextResponse.json({
			users: usersWithBookings,
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Admin users GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 },
		);
	}
});
