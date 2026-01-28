"use client";

import { useState, useEffect } from "react";

interface Booking {
	id: string;
	date: string;
	session: {
		type: string;
		startTime: string;
		endTime: string;
	};
	user: {
		name: string;
		email: string;
	} | null;
	paymentMethod: string;
}

export default function AdminBookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		startDate: "",
		endDate: "",
		userEmail: "",
	});

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			const params = new URLSearchParams();
			if (filters.startDate) params.append("startDate", filters.startDate);
			if (filters.endDate) params.append("endDate", filters.endDate);
			if (filters.userEmail) params.append("userEmail", filters.userEmail);

			const response = await fetch(`/api/admin/bookings?${params}`);
			if (!response.ok) throw new Error("Failed to fetch bookings");
			const data = await response.json();
			setBookings(data.bookings);
		} catch (error) {
			console.error("Error fetching bookings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = async (id: string) => {
		if (!confirm("Are you sure you want to cancel this booking?")) return;

		try {
			const response = await fetch(`/api/admin/bookings/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to cancel booking");
				return;
			}

			fetchBookings();
		} catch (error) {
			console.error("Error cancelling booking:", error);
			alert("Failed to cancel booking");
		}
	};

	if (loading) {
		return <div className="text-white">Loading...</div>;
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2">
					Bookings
				</h1>
				<p className="text-gray-400 text-sm sm:text-base">
					Manage customer bookings
				</p>
			</div>

			{/* Filters */}
			<div className="card-rounded-lg p-4 sm:p-6">
				<h2 className="font-display text-lg sm:text-xl text-white mb-3 sm:mb-4">
					Filters
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
					<div>
						<label className="block text-gray-400 text-xs sm:text-sm mb-2">
							Start Date
						</label>
						<input
							type="date"
							value={filters.startDate}
							onChange={(e) =>
								setFilters({ ...filters, startDate: e.target.value })
							}
							className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
						/>
					</div>
					<div>
						<label className="block text-gray-400 text-xs sm:text-sm mb-2">
							End Date
						</label>
						<input
							type="date"
							value={filters.endDate}
							onChange={(e) =>
								setFilters({ ...filters, endDate: e.target.value })
							}
							className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
						/>
					</div>
					<div>
						<label className="block text-gray-400 text-xs sm:text-sm mb-2">
							User Email
						</label>
						<input
							type="text"
							value={filters.userEmail}
							onChange={(e) =>
								setFilters({ ...filters, userEmail: e.target.value })
							}
							placeholder="Search by email"
							className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
						/>
					</div>
				</div>
				<button
					onClick={fetchBookings}
					className="mt-3 sm:mt-4 btn-lime text-xs sm:text-sm w-full sm:w-auto">
					Apply Filters
				</button>
			</div>

			{/* Bookings Table */}
			<div className="card-rounded-lg p-4 sm:p-6">
				{/* Mobile: Card View */}
				<div className="lg:hidden space-y-3">
					{bookings.map((booking) => (
						<div
							key={booking.id}
							className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
							<div className="flex items-start justify-between mb-2">
								<div className="text-white text-sm font-medium">
									{booking.session.type}
								</div>
								<span
									className={`text-xs px-2 py-1 rounded ${
										booking.paymentMethod === "credit" ?
											"bg-lime/20 text-lime"
										:	"bg-gray-800 text-gray-400"
									}`}>
									{booking.paymentMethod}
								</span>
							</div>
							<div className="text-gray-400 text-xs mb-1">
								{new Date(booking.date).toLocaleDateString()}
							</div>
							<div className="text-gray-400 text-xs mb-2">
								{booking.session.startTime} - {booking.session.endTime}
							</div>
							<div className="flex items-center justify-between">
								<div className="text-gray-500 text-xs">
									{booking.user?.name || booking.user?.email || "N/A"}
								</div>
								<button
									onClick={() => handleCancel(booking.id)}
									className="text-red-400 hover:text-red-500 text-xs">
									Cancel
								</button>
							</div>
						</div>
					))}
					{bookings.length === 0 && (
						<div className="text-center py-8 text-gray-400 text-sm">
							No bookings found
						</div>
					)}
				</div>

				{/* Desktop: Table View */}
				<div className="hidden lg:block overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Date
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Session
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Time
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									User
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Payment
								</th>
								<th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((booking) => (
								<tr
									key={booking.id}
									className="border-b border-gray-900 hover:bg-gray-900/50">
									<td className="py-3 px-4 text-white text-sm">
										{new Date(booking.date).toLocaleDateString()}
									</td>
									<td className="py-3 px-4 text-white text-sm">
										{booking.session.type}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{booking.session.startTime} - {booking.session.endTime}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{booking.user?.name || booking.user?.email || "N/A"}
									</td>
									<td className="py-3 px-4">
										<span
											className={`text-xs px-2 py-1 rounded ${
												booking.paymentMethod === "credit" ?
													"bg-lime/20 text-lime"
												:	"bg-gray-800 text-gray-400"
											}`}>
											{booking.paymentMethod}
										</span>
									</td>
									<td className="py-3 px-4 text-right">
										<button
											onClick={() => handleCancel(booking.id)}
											className="text-red-400 hover:text-red-500 text-sm">
											Cancel
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{bookings.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							No bookings found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
