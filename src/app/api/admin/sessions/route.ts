import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		const sessions = await prisma.session.findMany({
			include: {
				sessionType: true,
				_count: {
					select: {
						bookings: true,
					},
				},
			},
			orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
		});

		return NextResponse.json({
			sessions: sessions.map((session) => ({
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
			})),
		});
	} catch (error) {
		console.error("Admin sessions GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sessions" },
			{ status: 500 },
		);
	}
});

export const POST = withAdminAuth(async (request) => {
	try {
		const body = await request.json();
		const {
			sessionTypeId,
			dayOfWeek,
			startTime,
			endTime,
			maxCapacity,
			isPrivate,
		} = body;

		// Validate required fields
		if (!sessionTypeId || dayOfWeek === undefined || !startTime || !endTime) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: sessionTypeId, dayOfWeek, startTime, endTime",
				},
				{ status: 400 },
			);
		}

		// Validate dayOfWeek (0-6)
		if (dayOfWeek < 0 || dayOfWeek > 6) {
			return NextResponse.json(
				{ error: "dayOfWeek must be between 0 (Sunday) and 6 (Saturday)" },
				{ status: 400 },
			);
		}

		// Validate session type exists
		const sessionType = await prisma.sessionType.findUnique({
			where: { id: sessionTypeId },
		});

		if (!sessionType) {
			return NextResponse.json(
				{ error: "Session type not found" },
				{ status: 404 },
			);
		}

		// Create session
		const session = await prisma.session.create({
			data: {
				sessionTypeId,
				dayOfWeek: parseInt(dayOfWeek),
				startTime,
				endTime,
				maxCapacity: maxCapacity || 10,
				isPrivate: isPrivate || false,
			},
			include: {
				sessionType: true,
			},
		});

		return NextResponse.json(
			{
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
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Admin sessions POST error:", error);
		return NextResponse.json(
			{ error: "Failed to create session" },
			{ status: 500 },
		);
	}
});
