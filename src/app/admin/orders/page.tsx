"use client";

import { useState, useEffect } from "react";

interface Order {
	id: string;
	sumupReference: string;
	status: string;
	totalAmount: number;
	currency: string;
	user: {
		name: string;
		email: string;
	} | null;
	createdAt: string;
	paidAt: string | null;
}

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: "",
		startDate: "",
		endDate: "",
		userEmail: "",
	});

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const params = new URLSearchParams();
			if (filters.status) params.append("status", filters.status);
			if (filters.startDate) params.append("startDate", filters.startDate);
			if (filters.endDate) params.append("endDate", filters.endDate);
			if (filters.userEmail) params.append("userEmail", filters.userEmail);

			const response = await fetch(`/api/admin/orders?${params}`);
			if (!response.ok) throw new Error("Failed to fetch orders");
			const data = await response.json();
			setOrders(data.orders);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (orderId: string, newStatus: string) => {
		try {
			const response = await fetch(`/api/admin/orders/${orderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to update order");
				return;
			}

			fetchOrders();
		} catch (error) {
			console.error("Error updating order:", error);
			alert("Failed to update order");
		}
	};

	if (loading) {
		return <div className="text-white">Loading...</div>;
	}

	const statusColors: Record<string, string> = {
		PAID: "bg-green-500/20 text-green-400",
		PENDING: "bg-yellow-500/20 text-yellow-400",
		FAILED: "bg-red-500/20 text-red-400",
		REFUNDED: "bg-gray-500/20 text-gray-400",
		CANCELLED: "bg-red-500/20 text-red-400",
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2">
					Orders
				</h1>
				<p className="text-gray-400 text-sm sm:text-base">
					Manage customer orders
				</p>
			</div>

			{/* Filters */}
			<div className="card-rounded-lg p-4 sm:p-6">
				<h2 className="font-display text-lg sm:text-xl text-white mb-3 sm:mb-4">
					Filters
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					<div>
						<label className="block text-gray-400 text-xs sm:text-sm mb-2">
							Status
						</label>
						<select
							value={filters.status}
							onChange={(e) =>
								setFilters({ ...filters, status: e.target.value })
							}
							className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none">
							<option value="">All</option>
							<option value="PAID">Paid</option>
							<option value="PENDING">Pending</option>
							<option value="FAILED">Failed</option>
							<option value="REFUNDED">Refunded</option>
							<option value="CANCELLED">Cancelled</option>
						</select>
					</div>
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
					onClick={fetchOrders}
					className="mt-3 sm:mt-4 btn-lime text-xs sm:text-sm w-full sm:w-auto">
					Apply Filters
				</button>
			</div>

			{/* Orders Table */}
			<div className="card-rounded-lg p-4 sm:p-6">
				{/* Mobile: Card View */}
				<div className="lg:hidden space-y-3">
					{orders.map((order) => (
						<div
							key={order.id}
							className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
							<div className="flex items-start justify-between mb-2">
								<div>
									<div className="text-white text-xs font-mono mb-1">
										{order.sumupReference}
									</div>
									<div className="text-gray-400 text-xs">
										{order.user?.name || order.user?.email || "Guest"}
									</div>
								</div>
								<span
									className={`text-xs px-2 py-1 rounded ${statusColors[order.status] || "bg-gray-800 text-gray-400"}`}>
									{order.status}
								</span>
							</div>
							<div className="text-white text-sm font-medium mb-2">
								{order.currency} {order.totalAmount.toFixed(2)}
							</div>
							<div className="text-gray-500 text-xs mb-2">
								{new Date(order.createdAt).toLocaleDateString()}
							</div>
							<select
								value={order.status}
								onChange={(e) => handleStatusChange(order.id, e.target.value)}
								className="w-full px-2 py-1 rounded bg-gray-900 border border-gray-700 text-white text-xs focus:border-lime focus:outline-none">
								<option value="PENDING">Pending</option>
								<option value="PAID">Paid</option>
								<option value="FAILED">Failed</option>
								<option value="REFUNDED">Refunded</option>
								<option value="CANCELLED">Cancelled</option>
							</select>
						</div>
					))}
					{orders.length === 0 && (
						<div className="text-center py-8 text-gray-400 text-sm">
							No orders found
						</div>
					)}
				</div>

				{/* Desktop: Table View */}
				<div className="hidden lg:block overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Reference
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									User
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Amount
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Status
								</th>
								<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
									Date
								</th>
								<th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr
									key={order.id}
									className="border-b border-gray-900 hover:bg-gray-900/50">
									<td className="py-3 px-4 text-white text-sm font-mono">
										{order.sumupReference}
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{order.user?.name || order.user?.email || "Guest"}
									</td>
									<td className="py-3 px-4 text-white text-sm font-medium">
										{order.currency} {order.totalAmount.toFixed(2)}
									</td>
									<td className="py-3 px-4">
										<span
											className={`text-xs px-2 py-1 rounded ${statusColors[order.status] || "bg-gray-800 text-gray-400"}`}>
											{order.status}
										</span>
									</td>
									<td className="py-3 px-4 text-gray-400 text-sm">
										{new Date(order.createdAt).toLocaleDateString()}
									</td>
									<td className="py-3 px-4 text-right">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(order.id, e.target.value)
											}
											className="px-2 py-1 rounded bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none">
											<option value="PENDING">Pending</option>
											<option value="PAID">Paid</option>
											<option value="FAILED">Failed</option>
											<option value="REFUNDED">Refunded</option>
											<option value="CANCELLED">Cancelled</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{orders.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							No orders found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
