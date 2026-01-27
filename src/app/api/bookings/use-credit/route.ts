import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SessionToBook {
	sessionId: string;
	date: string; // ISO date string (YYYY-MM-DD)
}

interface UseCreditRequest {
	sessions: SessionToBook[];
}

// POST /api/bookings/use-credit - Book sessions using credits
export const POST = withAuth(async (request, { user }) => {
	try {
		const body: UseCreditRequest = await request.json();
		const { sessions } = body;

		if (!sessions || sessions.length === 0) {
			return NextResponse.json(
				{ error: "No sessions to book" },
				{ status: 400 },
			);
		}

		// Get Prisma user
		const prismaUser = await prisma.user.findUnique({
			where: { email: user.email! },
		});

		if (!prismaUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const now = new Date();

		// Get available credit purchases (FIFO - oldest expiring first)
		const creditPurchases = await prisma.creditPurchase.findMany({
			where: {
				userId: prismaUser.id,
				creditsRemaining: { gt: 0 },
				expiresAt: { gt: now },
			},
			orderBy: { expiresAt: "asc" },
		});

		// Calculate total available credits
		const totalAvailableCredits = creditPurchases.reduce(
			(sum, p) => sum + p.creditsRemaining,
			0,
		);

		if (totalAvailableCredits < sessions.length) {
			return NextResponse.json(
				{
					error: "Insufficient credits",
					available: totalAvailableCredits,
					required: sessions.length,
				},
				{ status: 400 },
			);
		}

		// Validate all sessions exist
		const sessionIds = sessions.map((s) => s.sessionId);
		const existingSessions = await prisma.session.findMany({
			where: { id: { in: sessionIds } },
			include: { sessionType: true },
		});

		if (existingSessions.length !== sessionIds.length) {
			return NextResponse.json(
				{ error: "One or more sessions not found" },
				{ status: 404 },
			);
		}

		// Create bookings and credit usages in a transaction
		// All checks happen INSIDE the transaction to prevent race conditions
		const result = await prisma.$transaction(async (tx) => {
			// Check for duplicate bookings INSIDE transaction (prevents race conditions)
			const existingBookings = await tx.booking.findMany({
				where: {
					sessionId: { in: sessionIds },
					date: {
						in: sessions.map((s) => new Date(s.date)),
					},
				},
			});

			// Filter out already booked sessions
			const alreadyBooked = new Set(
				existingBookings.map(
					(b) => `${b.sessionId}-${b.date.toISOString().split("T")[0]}`,
				),
			);

			const sessionsToBook = sessions.filter(
				(s) => !alreadyBooked.has(`${s.sessionId}-${s.date}`),
			);

			if (sessionsToBook.length === 0) {
				// Throw error inside transaction - this will rollback everything
				throw new Error("All sessions are already booked");
			}

			// Re-fetch credit purchases inside transaction to get latest state
			const txCreditPurchases = await tx.creditPurchase.findMany({
				where: {
					userId: prismaUser.id,
					creditsRemaining: { gt: 0 },
					expiresAt: { gt: now },
				},
				orderBy: { expiresAt: "asc" },
			});

			// Verify we still have enough credits
			const txTotalCredits = txCreditPurchases.reduce(
				(sum, p) => sum + p.creditsRemaining,
				0,
			);

			if (txTotalCredits < sessionsToBook.length) {
				throw new Error("Insufficient credits");
			}

			const createdBookings = [];
			let creditsUsed = 0;
			let purchaseIndex = 0;

			for (const session of sessionsToBook) {
				// Find credit purchase with remaining credits
				while (
					purchaseIndex < txCreditPurchases.length &&
					txCreditPurchases[purchaseIndex].creditsRemaining <= creditsUsed
				) {
					// Move to next purchase that has credits
					creditsUsed = 0;
					purchaseIndex++;
				}

				if (purchaseIndex >= txCreditPurchases.length) {
					throw new Error("Ran out of credits during booking");
				}

				const currentPurchase = txCreditPurchases[purchaseIndex];

				// Create booking (without orderId since this is credit-based)
				// The unique constraint should prevent duplicates, but we'll catch any violations
				let booking;
				try {
					booking = await tx.booking.create({
						data: {
							sessionId: session.sessionId,
							date: new Date(session.date),
						},
					});
				} catch (createError: any) {
					// Handle unique constraint violation (P2002 is Prisma's unique constraint error code)
					if (createError.code === "P2002") {
						throw new Error(
							"One or more sessions are already booked. Please refresh and try again.",
						);
					}
					throw createError;
				}

				// Create credit usage record
				await tx.creditUsage.create({
					data: {
						creditPurchaseId: currentPurchase.id,
						bookingId: booking.id,
						creditsUsed: 1,
					},
				});

				// Decrement credits remaining
				await tx.creditPurchase.update({
					where: { id: currentPurchase.id },
					data: {
						creditsRemaining: { decrement: 1 },
					},
				});

				// Track locally for the loop
				currentPurchase.creditsRemaining -= 1;
				creditsUsed++;

				createdBookings.push({
					id: booking.id,
					sessionId: session.sessionId,
					date: session.date,
				});
			}

			// Get updated credit total
			const updatedPurchases = await tx.creditPurchase.findMany({
				where: {
					userId: prismaUser.id,
					creditsRemaining: { gt: 0 },
					expiresAt: { gt: now },
				},
			});

			const creditsRemaining = updatedPurchases.reduce(
				(sum, p) => sum + p.creditsRemaining,
				0,
			);

			return {
				bookings: createdBookings,
				creditsUsed: sessionsToBook.length,
				creditsRemaining,
			};
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Book with credit error:", error);

		// Handle specific error messages
		const errorMessage =
			error instanceof Error ? error.message : "Failed to book sessions";

		// Check for "already booked" errors (could be from initial check or during creation)
		if (
			errorMessage === "All sessions are already booked" ||
			errorMessage.includes("already booked")
		) {
			return NextResponse.json(
				{
					error:
						"One or more sessions are already booked. Please refresh and try again.",
					details: errorMessage,
				},
				{ status: 400 },
			);
		}

		if (
			errorMessage === "Insufficient credits" ||
			errorMessage.includes("Ran out of credits")
		) {
			return NextResponse.json(
				{ error: "Insufficient credits" },
				{ status: 400 },
			);
		}

		// Generic error for other cases
		return NextResponse.json(
			{ error: "Failed to book sessions. Please try again." },
			{ status: 500 },
		);
	}
});
