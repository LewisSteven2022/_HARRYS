"use client";

import { useState, useEffect } from "react";

interface Session {
	id: string;
	sessionTypeId: string;
	sessionTypeName: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	maxCapacity: number;
	isPrivate: boolean;
	bookingCount: number;
}

interface SessionType {
	id: string;
	name: string;
	description: string | null;
}

const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export default function AdminSessionsPage() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingSession, setEditingSession] = useState<Session | null>(null);
	const [formData, setFormData] = useState({
		sessionTypeId: "",
		dayOfWeek: "1",
		startTime: "",
		endTime: "",
		maxCapacity: "10",
		isPrivate: false,
	});

	useEffect(() => {
		fetchSessions();
		fetchSessionTypes();
	}, []);

	const fetchSessions = async () => {
		try {
			const response = await fetch("/api/admin/sessions");
			if (!response.ok) throw new Error("Failed to fetch sessions");
			const data = await response.json();
			setSessions(data.sessions);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchSessionTypes = async () => {
		try {
			const response = await fetch("/api/sessions");
			if (!response.ok) throw new Error("Failed to fetch session types");
			const data = await response.json();
			setSessionTypes(data.sessionTypes);
		} catch (error) {
			console.error("Error fetching session types:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const url =
				editingSession ?
					`/api/admin/sessions/${editingSession.id}`
				:	"/api/admin/sessions";
			const method = editingSession ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionTypeId: formData.sessionTypeId,
					dayOfWeek: parseInt(formData.dayOfWeek),
					startTime: formData.startTime,
					endTime: formData.endTime,
					maxCapacity: parseInt(formData.maxCapacity),
					isPrivate: formData.isPrivate,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to save session");
				return;
			}

			setShowModal(false);
			setEditingSession(null);
			setFormData({
				sessionTypeId: "",
				dayOfWeek: "1",
				startTime: "",
				endTime: "",
				maxCapacity: "10",
				isPrivate: false,
			});
			fetchSessions();
		} catch (error) {
			console.error("Error saving session:", error);
			alert("Failed to save session");
		}
	};

	const handleEdit = (session: Session) => {
		setEditingSession(session);
		setFormData({
			sessionTypeId: session.sessionTypeId,
			dayOfWeek: session.dayOfWeek.toString(),
			startTime: session.startTime,
			endTime: session.endTime,
			maxCapacity: session.maxCapacity.toString(),
			isPrivate: session.isPrivate,
		});
		setShowModal(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this session?")) return;

		try {
			const response = await fetch(`/api/admin/sessions/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to delete session");
				return;
			}

			fetchSessions();
		} catch (error) {
			console.error("Error deleting session:", error);
			alert("Failed to delete session");
		}
	};

	const groupedSessions = sessions.reduce(
		(acc, session) => {
			const day = dayNames[session.dayOfWeek];
			if (!acc[day]) acc[day] = [];
			acc[day].push(session);
			return acc;
		},
		{} as Record<string, Session[]>,
	);

	if (loading) {
		return <div className="text-white">Loading...</div>;
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2">
						Sessions
					</h1>
					<p className="text-gray-400 text-sm sm:text-base">
						Manage session time slots
					</p>
				</div>
				<button
					onClick={() => {
						setEditingSession(null);
						setFormData({
							sessionTypeId: "",
							dayOfWeek: "1",
							startTime: "",
							endTime: "",
							maxCapacity: "10",
							isPrivate: false,
						});
						setShowModal(true);
					}}
					className="btn-lime text-xs sm:text-sm w-full sm:w-auto">
					Add Session
				</button>
			</div>

			{/* Sessions by Day */}
			<div className="space-y-4 sm:space-y-6">
				{Object.entries(groupedSessions).map(([day, daySessions]) => (
					<div key={day} className="card-rounded-lg p-4 sm:p-6">
						<h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
							{day}
						</h2>

						{/* Mobile: Card View */}
						<div className="lg:hidden space-y-3">
							{daySessions.map((session) => (
								<div
									key={session.id}
									className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
									<div className="flex items-start justify-between mb-2">
										<div className="text-white text-sm font-medium">
											{session.sessionTypeName}
										</div>
										{session.isPrivate ?
											<span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
												Private
											</span>
										:	<span className="text-xs px-2 py-1 bg-lime/20 text-lime rounded">
												Public
											</span>
										}
									</div>
									<div className="text-gray-400 text-xs mb-2">
										{session.startTime} - {session.endTime}
									</div>
									<div className="flex items-center justify-between">
										<div className="text-gray-500 text-xs">
											Capacity: {session.maxCapacity} | Bookings:{" "}
											{session.bookingCount}
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(session)}
												className="text-lime hover:text-lime-dark text-xs">
												Edit
											</button>
											<button
												onClick={() => handleDelete(session.id)}
												disabled={session.bookingCount > 0}
												className="text-red-400 hover:text-red-500 text-xs disabled:text-gray-600 disabled:cursor-not-allowed">
												Delete
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Desktop: Table View */}
						<div className="hidden lg:block overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-800">
										<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
											Type
										</th>
										<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
											Time
										</th>
										<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
											Capacity
										</th>
										<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
											Status
										</th>
										<th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
											Bookings
										</th>
										<th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{daySessions.map((session) => (
										<tr
											key={session.id}
											className="border-b border-gray-900 hover:bg-gray-900/50">
											<td className="py-3 px-4 text-white text-sm">
												{session.sessionTypeName}
											</td>
											<td className="py-3 px-4 text-gray-400 text-sm">
												{session.startTime} - {session.endTime}
											</td>
											<td className="py-3 px-4 text-gray-400 text-sm">
												{session.maxCapacity}
											</td>
											<td className="py-3 px-4">
												{session.isPrivate ?
													<span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
														Private
													</span>
												:	<span className="text-xs px-2 py-1 bg-lime/20 text-lime rounded">
														Public
													</span>
												}
											</td>
											<td className="py-3 px-4 text-gray-400 text-sm">
												{session.bookingCount}
											</td>
											<td className="py-3 px-4 text-right">
												<div className="flex justify-end gap-2">
													<button
														onClick={() => handleEdit(session)}
														className="text-lime hover:text-lime-dark text-sm">
														Edit
													</button>
													<button
														onClick={() => handleDelete(session.id)}
														disabled={session.bookingCount > 0}
														className="text-red-400 hover:text-red-500 text-sm disabled:text-gray-600 disabled:cursor-not-allowed">
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>

			{/* Add/Edit Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 w-full max-w-md border border-gray-800 max-h-[90vh] overflow-y-auto">
						<h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
							{editingSession ? "Edit Session" : "Add Session"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
							<div>
								<label className="block text-gray-400 text-xs sm:text-sm mb-2">
									Session Type
								</label>
								<select
									value={formData.sessionTypeId}
									onChange={(e) =>
										setFormData({ ...formData, sessionTypeId: e.target.value })
									}
									required
									className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none">
									<option value="">Select type</option>
									{sessionTypes.map((type) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-gray-400 text-xs sm:text-sm mb-2">
									Day of Week
								</label>
								<select
									value={formData.dayOfWeek}
									onChange={(e) =>
										setFormData({ ...formData, dayOfWeek: e.target.value })
									}
									required
									className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none">
									{dayNames.map((day, index) => (
										<option key={index} value={index}>
											{day}
										</option>
									))}
								</select>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div>
									<label className="block text-gray-400 text-xs sm:text-sm mb-2">
										Start Time
									</label>
									<input
										type="time"
										value={formData.startTime}
										onChange={(e) =>
											setFormData({ ...formData, startTime: e.target.value })
										}
										required
										className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
									/>
								</div>
								<div>
									<label className="block text-gray-400 text-xs sm:text-sm mb-2">
										End Time
									</label>
									<input
										type="time"
										value={formData.endTime}
										onChange={(e) =>
											setFormData({ ...formData, endTime: e.target.value })
										}
										required
										className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
									/>
								</div>
							</div>

							<div>
								<label className="block text-gray-400 text-xs sm:text-sm mb-2">
									Max Capacity
								</label>
								<input
									type="number"
									value={formData.maxCapacity}
									onChange={(e) =>
										setFormData({ ...formData, maxCapacity: e.target.value })
									}
									required
									min="1"
									className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
								/>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="isPrivate"
									checked={formData.isPrivate}
									onChange={(e) =>
										setFormData({ ...formData, isPrivate: e.target.checked })
									}
									className="w-4 h-4"
								/>
								<label
									htmlFor="isPrivate"
									className="text-gray-400 text-xs sm:text-sm">
									Private Session
								</label>
							</div>

							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
								<button
									type="button"
									onClick={() => {
										setShowModal(false);
										setEditingSession(null);
									}}
									className="flex-1 px-4 py-2 border border-gray-700 text-gray-400 rounded-lg hover:border-gray-600 hover:text-white transition-colors text-sm">
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 btn-lime text-xs sm:text-sm">
									{editingSession ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
