"use client";

import { useState, useEffect } from "react";

interface User {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	phone: string | null;
	isAdmin: boolean;
	createdAt: string;
	stats: {
		orders: number;
		creditPurchases: number;
		bookings: number;
	};
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const params = new URLSearchParams();
			if (search) params.append("search", search);

			const response = await fetch(`/api/admin/users?${params}`);
			if (!response.ok) throw new Error("Failed to fetch users");
			const data = await response.json();
			setUsers(data.users);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isAdmin: !currentStatus }),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to update user");
				return;
			}

			fetchUsers();
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Failed to update user");
		}
	};

	if (loading) {
		return <div className="text-white">Loading...</div>;
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2">
					Users
				</h1>
				<p className="text-gray-400 text-sm sm:text-base">
					Manage user accounts
				</p>
			</div>

			{/* Search */}
			<div className="card-rounded-lg p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by email or name"
						className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
					/>
					<button
						onClick={fetchUsers}
						className="btn-lime text-xs sm:text-sm w-full sm:w-auto">
						Search
					</button>
				</div>
			</div>

			{/* Users Table */}
			<div className="card-rounded-lg p-4 sm:p-6">
				{/* Mobile: Card View */}
				<div className="lg:hidden space-y-3">
					{users.map((user) => (
						<div
							key={user.id}
							className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
							<div className="flex items-start justify-between mb-2">
								<div>
									<div className="text-white text-sm font-medium">
										{user.firstName || user.lastName ?
											`${user.firstName || ""} ${user.lastName || ""}`.trim()
										:	"N/A"}
									</div>
									<div className="text-gray-400 text-xs mt-1">{user.email}</div>
								</div>
								<button
									onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
									className={`text-xs px-2 py-1 rounded transition-colors ${
										user.isAdmin ?
											"bg-lime/20 text-lime"
										:	"bg-gray-800 text-gray-400"
									}`}>
									{user.isAdmin ? "Admin" : "User"}
								</button>
							</div>
							<div className="text-gray-500 text-xs mt-2 space-y-1">
								<div>Orders: {user.stats.orders}</div>
								<div>Bookings: {user.stats.bookings}</div>
								{user.phone && <div>Phone: {user.phone}</div>}
							</div>
						</div>
					))}
					{users.length === 0 && (
						<div className="text-center py-8 text-gray-400 text-sm">
							No users found
						</div>
					)}
				</div>

				{/* Desktop: Table View */}
				<div className="hidden lg:block overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Name
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Email
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Phone
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Orders
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Bookings
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Admin
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Joined
								</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user.id}
									className="border-b border-gray-900 hover:bg-gray-900/50">
									<td className="py-3 px-4 text-white text-sm">
										{user.firstName || user.lastName ?
											`${user.firstName || ""} ${user.lastName || ""}`.trim()
										:	"N/A"}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{user.email}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{user.phone || "N/A"}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{user.stats.orders}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{user.stats.bookings}
									</td>
									<td className="py-3 px-4">
										<button
											onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
											className={`text-xs px-2 py-1 rounded transition-colors ${
												user.isAdmin ?
													"bg-lime/20 text-lime hover:bg-lime/30"
												:	"bg-gray-800 text-gray-400 hover:bg-gray-700"
											}`}>
											{user.isAdmin ? "Admin" : "User"}
										</button>
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{new Date(user.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{users.length === 0 && (
						<div className="text-center py-8 text-gray-400">No users found</div>
					)}
				</div>
			</div>
		</div>
	);
}
