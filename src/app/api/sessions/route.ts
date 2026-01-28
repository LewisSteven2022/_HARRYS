import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sessions - Get sessions for a date range (defaults to 2 months from today)
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const startDateParam = searchParams.get("startDate");
		const endDateParam = searchParams.get("endDate");

		// Default to 2 months from today
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const startDate = startDateParam ? new Date(startDateParam) : today;
		const endDate =
			endDateParam ?
				new Date(endDateParam)
			:	new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days

		// Fetch all session templates (day of week patterns)
		const sessionTemplates = await prisma.session.findMany({
			include: {
				sessionType: true,
			},
			orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
		});

		// Get session price from config
		const config = await prisma.siteConfig.findFirst();
		const sessionPrice =
			config?.sessionPrice ? Number(config.sessionPrice) : 15;

		// Generate sessions for each date in the range
		const sessionsByDate: Record<
			string,
			Array<{
				id: string;
				typeId: string;
				typeName: string;
				startTime: string;
				endTime: string;
				isPrivate: boolean;
				maxCapacity: number;
				dayOfWeek: number;
			}>
		> = {};

		const now = new Date();
		const todayStr = today.toISOString().split("T")[0];

		const currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			const dateStr = currentDate.toISOString().split("T")[0];
			const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

			// Skip past dates entirely
			if (dateStr < todayStr) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			// Find sessions that match this day of week
			const matchingTemplates = sessionTemplates.filter(
				(t) => t.dayOfWeek === dayOfWeek,
			);

			if (matchingTemplates.length > 0) {
				// For today's date, filter out sessions that have already started
				const sessionsForDate = matchingTemplates
					.map((template) => ({
						id: template.id,
						typeId: template.sessionTypeId,
						typeName: template.sessionType.name,
						startTime: template.startTime,
						endTime: template.endTime,
						isPrivate: template.isPrivate,
						maxCapacity: template.maxCapacity,
						dayOfWeek: template.dayOfWeek,
					}))
					.filter((session) => {
						// If this is today, check if the session start time has passed
						if (dateStr === todayStr) {
							const [hours, minutes] = session.startTime.split(":").map(Number);
							const sessionStartTime = new Date(now);
							sessionStartTime.setHours(hours, minutes, 0, 0);

							// Only include sessions that haven't started yet
							return sessionStartTime > now;
						}

						// For future dates, include all sessions
						return true;
					});

				if (sessionsForDate.length > 0) {
					sessionsByDate[dateStr] = sessionsForDate;
				}
			}

			// Move to next day
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Get all session types for reference
		const sessionTypes = await prisma.sessionType.findMany({
			orderBy: { name: "asc" },
		});

		return NextResponse.json({
			sessionsByDate,
			sessionTypes: sessionTypes.map((st) => ({
				id: st.id,
				name: st.name,
				description: st.description,
			})),
			sessionPrice,
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		});
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sessions" },
			{ status: 500 },
		);
	}
}
