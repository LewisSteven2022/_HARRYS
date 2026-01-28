import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "./supabase/server";
import { prisma } from "./prisma";
import type { User } from "@supabase/supabase-js";

export type AdminHandler<P = Record<string, string>> = (
	request: NextRequest,
	context: { user: User; params: Promise<P> },
) => Promise<NextResponse> | NextResponse;

/**
 * Check if a user is an admin by querying the database
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { isAdmin: true },
		});
		return user?.isAdmin ?? false;
	} catch (error) {
		console.error("Error checking admin status:", error);
		return false;
	}
}

/**
 * Wraps an API route handler with admin authentication.
 * - First checks if user is authenticated
 * - Then verifies user has isAdmin: true in database
 * - Returns 401 if not authenticated
 * - Returns 403 if authenticated but not admin
 */
export function withAdminAuth<P = Record<string, string>>(
	handler: AdminHandler<P>,
	options?: { hasParams?: boolean },
) {
	return async (
		request: NextRequest,
		routeContext?: { params: Promise<P> },
	) => {
		// Check if Supabase is configured
		if (!isSupabaseConfigured()) {
			return NextResponse.json(
				{ error: "Authentication not configured" },
				{ status: 503 },
			);
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Authentication service unavailable" },
				{ status: 503 },
			);
		}

		// First check if user is authenticated
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			const acceptHeader = request.headers.get("accept") || "";
			const isApiRequest =
				acceptHeader.includes("application/json") ||
				request.headers.get("x-requested-with") === "XMLHttpRequest";

			if (isApiRequest) {
				return NextResponse.json(
					{ error: "Unauthorized", message: "Please sign in to continue" },
					{ status: 401 },
				);
			}

			// Browser request - redirect to login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Check if user is admin
		const isAdmin = await checkIsAdmin(user.id);
		if (!isAdmin) {
			const acceptHeader = request.headers.get("accept") || "";
			const isApiRequest =
				acceptHeader.includes("application/json") ||
				request.headers.get("x-requested-with") === "XMLHttpRequest";

			if (isApiRequest) {
				return NextResponse.json(
					{ error: "Forbidden", message: "Admin access required" },
					{ status: 403 },
				);
			}

			// Browser request - redirect to account page
			return NextResponse.redirect(new URL("/account", request.url));
		}

		// User is authenticated and is admin - call the handler
		const params = routeContext?.params ?? Promise.resolve({} as P);
		return handler(request, { user, params });
	};
}

/**
 * Check if current user is admin (for server components)
 */
export async function getAdminStatus(userId: string): Promise<boolean> {
	return checkIsAdmin(userId);
}
