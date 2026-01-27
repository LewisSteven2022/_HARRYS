import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSumUpCheckout } from "@/lib/sumup";
import { getUser } from "@/lib/auth";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ reference: string }> },
) {
	try {
		const { reference } = await params;
		const user = await getUser();

		if (!reference) {
			return NextResponse.json(
				{ error: "Reference is required" },
				{ status: 400 },
			);
		}

		// Find order by reference with relationships
		const order = await prisma.order.findUnique({
			where: { sumupReference: reference },
			include: {
				creditPackage: true,
				creditPurchase: true,
			},
		});

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// If order is PAID but missing credit purchase (webhook may have failed), create it
		if (
			order.status === "PAID" &&
			order.creditPackage &&
			order.userId &&
			!order.creditPurchase
		) {
			try {
				const expiresAt = new Date();
				expiresAt.setMonth(expiresAt.getMonth() + 12); // 12 months expiration

				await prisma.creditPurchase.create({
					data: {
						userId: order.userId,
						packageId: order.creditPackage.id,
						orderId: order.id,
						creditsReceived: order.creditPackage.sessionCount,
						creditsRemaining: order.creditPackage.sessionCount,
						expiresAt,
					},
				});
				console.log(
					`Created missing credit purchase: ${order.creditPackage.sessionCount} credits for user ${order.userId}`,
				);
			} catch (error) {
				console.error("Failed to create missing credit purchase:", error);
				// Continue even if this fails
			}
		}

		// Security: If order belongs to a user, only that user can view it
		if (order.userId && order.userId !== user?.id) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// If order is still pending, check SumUp for latest status
		if (order.status === "PENDING" && order.sumupCheckoutId) {
			try {
				const checkout = await getSumUpCheckout(order.sumupCheckoutId);

				// Update order if payment completed
				if (checkout.status === "PAID") {
					// Get full order details with relationships
					const orderWithDetails = await prisma.order.findUnique({
						where: { id: order.id },
						include: {
							orderItems: true,
							creditPackage: true,
							creditPurchase: true,
						},
					});

					if (!orderWithDetails) {
						throw new Error("Order not found");
					}

					// Handle credit package purchases
					if (orderWithDetails.creditPackage && orderWithDetails.userId) {
						// Check if credit purchase already exists (webhook may have created it)
						if (!orderWithDetails.creditPurchase) {
							// Create credit purchase record (fallback for missed webhook)
							const expiresAt = new Date();
							expiresAt.setMonth(expiresAt.getMonth() + 12); // 12 months expiration

							await prisma.creditPurchase.create({
								data: {
									userId: orderWithDetails.userId,
									packageId: orderWithDetails.creditPackage.id,
									orderId: orderWithDetails.id,
									creditsReceived: orderWithDetails.creditPackage.sessionCount,
									creditsRemaining: orderWithDetails.creditPackage.sessionCount,
									expiresAt,
								},
							});
							console.log(
								`Created credit purchase: ${orderWithDetails.creditPackage.sessionCount} credits for user ${orderWithDetails.userId}`,
							);
						}
					} else {
						// Handle regular session bookings
						// Check if bookings already exist (webhook may have created them)
						const existingBookings = await prisma.booking.count({
							where: { orderId: order.id },
						});

						// Create bookings if they don't exist (fallback for missed webhook)
						if (existingBookings === 0 && orderWithDetails.orderItems.length) {
							await prisma.booking.createMany({
								data: orderWithDetails.orderItems.map((item) => ({
									orderId: order.id,
									sessionId: item.sessionId,
									date: item.sessionDate,
								})),
								skipDuplicates: true,
							});
						}
					}

					const updatedOrder = await prisma.order.update({
						where: { id: order.id },
						data: {
							status: "PAID",
							paidAt: new Date(),
						},
					});

					return NextResponse.json({
						reference: updatedOrder.sumupReference,
						status: updatedOrder.status,
						email: user?.email || updatedOrder.guestEmail,
						name: user?.user_metadata?.name || updatedOrder.guestName,
						amount: Number(updatedOrder.totalAmount),
						paidAt: updatedOrder.paidAt,
					});
				} else if (checkout.status === "FAILED") {
					await prisma.order.update({
						where: { id: order.id },
						data: { status: "FAILED" },
					});

					return NextResponse.json({
						reference: order.sumupReference,
						status: "FAILED",
					});
				}
			} catch (sumupError) {
				console.error("Error checking SumUp status:", sumupError);
				// Continue with current order status if SumUp check fails
			}
		}

		return NextResponse.json({
			reference: order.sumupReference,
			status: order.status,
			email: user?.email || order.guestEmail,
			name: user?.user_metadata?.name || order.guestName,
			amount: Number(order.totalAmount),
			paidAt: order.paidAt,
		});
	} catch (error) {
		console.error("Order verification error:", error);
		return NextResponse.json(
			{ error: "Failed to verify order" },
			{ status: 500 },
		);
	}
}
