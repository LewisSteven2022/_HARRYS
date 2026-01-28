"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SignOutButton from "../account/SignOutButton";

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: "📊" },
	{ href: "/admin/sessions", label: "Sessions", icon: "📅" },
	{ href: "/admin/bookings", label: "Bookings", icon: "🎫" },
	{ href: "/admin/users", label: "Users", icon: "👥" },
	{ href: "/admin/orders", label: "Orders", icon: "💰" },
	{ href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();

	// Close sidebar when route changes on mobile
	useEffect(() => {
		setSidebarOpen(false);
	}, [pathname]);

	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			{/* Mobile Header */}
			<header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-900 px-4 py-3 flex items-center justify-between">
				<Link
					href="/admin"
					className="text-lime font-display text-lg tracking-wide">
					ADMIN
				</Link>
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="text-white p-2"
					aria-label="Toggle menu">
					<div className="space-y-1.5 w-6">
						<span
							className={`block h-0.5 bg-white transition-all ${
								sidebarOpen ? "rotate-45 translate-y-2" : ""
							}`}
						/>
						<span
							className={`block h-0.5 bg-white transition-all ${
								sidebarOpen ? "opacity-0" : ""
							}`}
						/>
						<span
							className={`block h-0.5 bg-white transition-all ${
								sidebarOpen ? "-rotate-45 -translate-y-2" : ""
							}`}
						/>
					</div>
				</button>
			</header>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black/50 z-40"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-gray-900 z-40 transition-transform duration-300 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0 w-64`}>
				<div className="flex flex-col h-full">
					{/* Logo/Header */}
					<div className="p-4 lg:p-6 border-b border-gray-900">
						<Link href="/admin" className="flex items-center gap-2">
							<span className="text-lime font-display text-xl tracking-wide">
								ADMIN
							</span>
						</Link>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
										isActive ?
											"text-white bg-gray-900"
										:	"text-gray-400 hover:text-white hover:bg-gray-900"
									}`}>
									<span className="text-lg">{item.icon}</span>
									<span className="text-sm font-medium">{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-gray-900">
						<div className="flex flex-col gap-2">
							<Link
								href="/account"
								className="text-center px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-900 rounded transition-colors">
								Account
							</Link>
							<SignOutButton />
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
				<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
					{children}
				</div>
			</main>
		</div>
	);
}
