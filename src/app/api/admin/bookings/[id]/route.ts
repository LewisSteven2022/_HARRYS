import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return withAdminAuth(async (request, { params: resolvedParams }) => {
		try {
			const { id } = await resolvedParams;

			// Get booking with related data
			const booking = await prisma.booking.findUnique({
				where: { id },
				include: {
					order: true,
					creditUsage: {
						include: {
							creditPurchase: true,
						},
					},
				},
			});

			if (!booking) {
				return NextResponse.json(
					{ error: "Booking not found" },
					{ status: 404 },
				);
			}

			// Use transaction to ensure data consistency
			await prisma.$transaction(async (tx) => {
				// If booking was paid via order, we might want to handle refund
				// For now, we'll just delete the booking
				// If it was credit-based, restore the credit
				if (booking.creditUsage) {
					// Restore credit
					await tx.creditPurchase.update({
						where: { id: booking.creditUsage.creditPurchaseId },
						data: {
							creditsRemaining: {
								increment: booking.creditUsage.creditsUsed,
							},
						},
					});

					// Delete credit usage record
					await tx.creditUsage.delete({
						where: { id: booking.creditUsage.id },
					});
				}

				// Delete the booking
				await tx.booking.delete({
					where: { id },
				});
			});

			return NextResponse.json({
				success: true,
				message: "Booking cancelled successfully",
			});
		} catch (error) {
			console.error("Admin booking DELETE error:", error);
			return NextResponse.json(
				{ error: "Failed to cancel booking" },
				{ status: 500 },
			);
		}
	})(request, { params });
}
