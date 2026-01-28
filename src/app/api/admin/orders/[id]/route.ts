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

			const order = await prisma.order.findUnique({
				where: { id },
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

			if (!order) {
				return NextResponse.json({ error: "Order not found" }, { status: 404 });
			}

			return NextResponse.json({
				order: {
					id: order.id,
					sumupReference: order.sumupReference,
					sumupCheckoutId: order.sumupCheckoutId,
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
								phone: order.user.phone,
							}
						:	{
								name: order.guestName,
								email: order.guestEmail,
							},
					creditPackage:
						order.creditPackage ?
							{
								id: order.creditPackage.id,
								name: order.creditPackage.name,
								sessionCount: order.creditPackage.sessionCount,
								price: Number(order.creditPackage.price),
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
						startTime: item.session.startTime,
						endTime: item.session.endTime,
					})),
					createdAt: order.createdAt.toISOString(),
					updatedAt: order.updatedAt.toISOString(),
					paidAt: order.paidAt?.toISOString(),
				},
			});
		} catch (error) {
			console.error("Admin order GET error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch order" },
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
			const { status } = body;

			if (!status) {
				return NextResponse.json(
					{ error: "Status is required" },
					{ status: 400 },
				);
			}

			const validStatuses = [
				"PENDING",
				"PAID",
				"FAILED",
				"REFUNDED",
				"CANCELLED",
			];
			if (!validStatuses.includes(status)) {
				return NextResponse.json(
					{
						error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
					},
					{ status: 400 },
				);
			}

			const existingOrder = await prisma.order.findUnique({
				where: { id },
			});

			if (!existingOrder) {
				return NextResponse.json({ error: "Order not found" }, { status: 404 });
			}

			const order = await prisma.order.update({
				where: { id },
				data: {
					status,
					...(status === "PAID" &&
						!existingOrder.paidAt && { paidAt: new Date() }),
				},
				include: {
					user: true,
				},
			});

			return NextResponse.json({
				order: {
					id: order.id,
					status: order.status,
					paidAt: order.paidAt?.toISOString(),
				},
			});
		} catch (error) {
			console.error("Admin order PUT error:", error);
			return NextResponse.json(
				{ error: "Failed to update order" },
				{ status: 500 },
			);
		}
	})(request, { params });
}
