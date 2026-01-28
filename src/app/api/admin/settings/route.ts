import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (request) => {
	try {
		let config = await prisma.siteConfig.findFirst();

		// Create default config if it doesn't exist
		if (!config) {
			config = await prisma.siteConfig.create({
				data: {
					id: "default",
					sessionPrice: 15.0,
					currency: "GBP",
				},
			});
		}

		return NextResponse.json({
			config: {
				sessionPrice: Number(config.sessionPrice),
				currency: config.currency,
				updatedAt: config.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("Admin settings GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch settings" },
			{ status: 500 },
		);
	}
});

export const PUT = withAdminAuth(async (request) => {
	try {
		const body = await request.json();
		const { sessionPrice, currency } = body;

		if (sessionPrice === undefined && currency === undefined) {
			return NextResponse.json(
				{ error: "At least one field (sessionPrice or currency) is required" },
				{ status: 400 },
			);
		}

		// Get or create config
		let config = await prisma.siteConfig.findFirst();

		if (!config) {
			config = await prisma.siteConfig.create({
				data: {
					id: "default",
					sessionPrice: sessionPrice || 15.0,
					currency: currency || "GBP",
				},
			});
		} else {
			config = await prisma.siteConfig.update({
				where: { id: "default" },
				data: {
					...(sessionPrice !== undefined && { sessionPrice }),
					...(currency !== undefined && { currency }),
				},
			});
		}

		return NextResponse.json({
			config: {
				sessionPrice: Number(config.sessionPrice),
				currency: config.currency,
				updatedAt: config.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("Admin settings PUT error:", error);
		return NextResponse.json(
			{ error: "Failed to update settings" },
			{ status: 500 },
		);
	}
});
