import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return withAdminAuth(async (request, { params: resolvedParams }) => {
		try {
			const { id } = await resolvedParams;

			const user = await prisma.user.findUnique({
				where: { id },
				include: {
					orders: {
						take: 10,
						orderBy: { createdAt: "desc" },
						include: {
							bookings: {
								include: {
									session: {
										include: {
											sessionType: true,
										},
									},
								},
							},
						},
					},
					creditPurchases: {
						take: 10,
						orderBy: { createdAt: "desc" },
						include: {
							package: true,
						},
					},
					_count: {
						select: {
							orders: true,
							creditPurchases: true,
						},
					},
				},
			});

			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

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

			return NextResponse.json({
				user: {
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
					recentOrders: user.orders,
					recentCreditPurchases: user.creditPurchases,
				},
			});
		} catch (error) {
			console.error("Admin user GET error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch user" },
				{ status: 500 },
			);
		}
	})(request, { params });
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return withAdminAuth(async (request, { params: resolvedParams }) => {
		try {
			const { id } = await resolvedParams;
			const body = await request.json();
			const { firstName, lastName, phone, isAdmin } = body;

			// Check if user exists
			const existingUser = await prisma.user.findUnique({
				where: { id },
			});

			if (!existingUser) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

			// Update user
			const user = await prisma.user.update({
				where: { id },
				data: {
					...(firstName !== undefined && { firstName }),
					...(lastName !== undefined && { lastName }),
					...(phone !== undefined && { phone }),
					...(isAdmin !== undefined && { isAdmin }),
				},
			});

			return NextResponse.json({
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					phone: user.phone,
					isAdmin: user.isAdmin,
					createdAt: user.createdAt.toISOString(),
					updatedAt: user.updatedAt.toISOString(),
				},
			});
		} catch (error) {
			console.error("Admin user PUT error:", error);
			return NextResponse.json(
				{ error: "Failed to update user" },
				{ status: 500 },
			);
		}
	})(request, { params });
}
