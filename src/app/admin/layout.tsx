import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check if Supabase is configured
	if (!isSupabaseConfigured()) {
		redirect("/");
	}

	const supabase = await createClient();
	if (!supabase) {
		redirect("/");
	}

	// Check authentication
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/login?redirect=/admin");
	}

	// Check admin status
	const { getAdminStatus } = await import("@/lib/admin");
	const isAdmin = await getAdminStatus(user.id);
	if (!isAdmin) {
		redirect("/account");
	}

	return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
