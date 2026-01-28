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
			const session = await prisma.session.findUnique({
				where: { id },
				include: {
					sessionType: true,
					_count: {
						select: {
							bookings: true,
						},
					},
				},
			});

			if (!session) {
				return NextResponse.json(
					{ error: "Session not found" },
					{ status: 404 },
				);
			}

			return NextResponse.json({
				session: {
					id: session.id,
					sessionTypeId: session.sessionTypeId,
					sessionTypeName: session.sessionType.name,
					dayOfWeek: session.dayOfWeek,
					startTime: session.startTime,
					endTime: session.endTime,
					maxCapacity: session.maxCapacity,
					isPrivate: session.isPrivate,
					bookingCount: session._count.bookings,
					createdAt: session.createdAt.toISOString(),
					updatedAt: session.updatedAt.toISOString(),
				},
			});
		} catch (error) {
			console.error("Admin session GET error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch session" },
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
			const {
				sessionTypeId,
				dayOfWeek,
				startTime,
				endTime,
				maxCapacity,
				isPrivate,
			} = body;

			// Check if session exists
			const existingSession = await prisma.session.findUnique({
				where: { id },
			});

			if (!existingSession) {
				return NextResponse.json(
					{ error: "Session not found" },
					{ status: 404 },
				);
			}

			// Validate session type if provided
			if (sessionTypeId) {
				const sessionType = await prisma.sessionType.findUnique({
					where: { id: sessionTypeId },
				});

				if (!sessionType) {
					return NextResponse.json(
						{ error: "Session type not found" },
						{ status: 404 },
					);
				}
			}

			// Update session
			const session = await prisma.session.update({
				where: { id },
				data: {
					...(sessionTypeId && { sessionTypeId }),
					...(dayOfWeek !== undefined && { dayOfWeek: parseInt(dayOfWeek) }),
					...(startTime && { startTime }),
					...(endTime && { endTime }),
					...(maxCapacity !== undefined && { maxCapacity }),
					...(isPrivate !== undefined && { isPrivate }),
				},
				include: {
					sessionType: true,
				},
			});

			return NextResponse.json({
				session: {
					id: session.id,
					sessionTypeId: session.sessionTypeId,
					sessionTypeName: session.sessionType.name,
					dayOfWeek: session.dayOfWeek,
					startTime: session.startTime,
					endTime: session.endTime,
					maxCapacity: session.maxCapacity,
					isPrivate: session.isPrivate,
					createdAt: session.createdAt.toISOString(),
					updatedAt: session.updatedAt.toISOString(),
				},
			});
		} catch (error) {
			console.error("Admin session PUT error:", error);
			return NextResponse.json(
				{ error: "Failed to update session" },
				{ status: 500 },
			);
		}
	})(request, { params });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return withAdminAuth(async (request, { params: resolvedParams }) => {
		try {
			const { id } = await resolvedParams;

			// Check if session exists and has bookings
			const session = await prisma.session.findUnique({
				where: { id },
				include: {
					_count: {
						select: {
							bookings: true,
						},
					},
				},
			});

			if (!session) {
				return NextResponse.json(
					{ error: "Session not found" },
					{ status: 404 },
				);
			}

			if (session._count.bookings > 0) {
				return NextResponse.json(
					{ error: "Cannot delete session with existing bookings" },
					{ status: 400 },
				);
			}

			// Delete session
			await prisma.session.delete({
				where: { id },
			});

			return NextResponse.json({ success: true });
		} catch (error) {
			console.error("Admin session DELETE error:", error);
			return NextResponse.json(
				{ error: "Failed to delete session" },
				{ status: 500 },
			);
		}
	})(request, { params });
}
