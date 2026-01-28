"use client";

import { useMemo, useState, useEffect } from "react";
import SessionCard from "@/components/SessionCard";

// Helper function to format time from "06:15" to "6:15am"
function formatTime(time24: string): string {
	const [hours, minutes] = time24.split(":");
	const hour = parseInt(hours, 10);
	const minute = minutes || "00";
	const period = hour >= 12 ? "pm" : "am";
	const displayHour =
		hour === 0 ? 12
		: hour > 12 ? hour - 12
		: hour;
	return `${displayHour}:${minute}${period}`;
}

interface SessionType {
	id: string;
	name: string;
	description: string | null;
}

interface Session {
	id: string;
	typeId: string;
	typeName: string;
	startTime: string;
	endTime: string;
	isPrivate: boolean;
	maxCapacity: number;
}

interface SessionsData {
	sessionsByDate: Record<string, Array<Session & { dayOfWeek: number }>>;
	sessionTypes: SessionType[];
	sessionPrice: number;
	startDate: string;
	endDate: string;
}

const DAY_NAMES = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
const MONTH_NAMES = [
	"JANUARY",
	"FEBRUARY",
	"MARCH",
	"APRIL",
	"MAY",
	"JUNE",
	"JULY",
	"AUGUST",
	"SEPTEMBER",
	"OCTOBER",
	"NOVEMBER",
	"DECEMBER",
];

function formatDateISO(date: Date): string {
	return date.toISOString().split("T")[0];
}

export default function Timetable() {
	const [sessionsData, setSessionsData] = useState<SessionsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, 1 = next week, etc.
	const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
		new Set(),
	); // Empty = show all

	// Fetch 2 months of sessions on mount
	useEffect(() => {
		async function fetchSessions() {
			try {
				const today = new Date();
				const endDate = new Date(today);
				endDate.setDate(today.getDate() + 60); // 2 months

				const response = await fetch(
					`/api/sessions?startDate=${today.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch sessions");
				}
				const data = await response.json();
				setSessionsData(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load schedule",
				);
				console.error("Error fetching sessions:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchSessions();
	}, []);

	// Calculate current week dates based on offset
	const { monday, dates } = useMemo(() => {
		const today = new Date();
		const dayOfWeek = today.getDay();
		const currentMonday = new Date(today);
		currentMonday.setDate(
			today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
		);
		currentMonday.setDate(currentMonday.getDate() + currentWeekOffset * 7);

		const weekDates: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(currentMonday);
			date.setDate(currentMonday.getDate() + i);
			weekDates.push(date);
		}

		return { monday: currentMonday, dates: weekDates };
	}, [currentWeekOffset]);

	const SESSION_PRICE = sessionsData?.sessionPrice || 15;
	const SESSION_TYPES = useMemo(() => {
		if (!sessionsData?.sessionTypes) return {};
		return sessionsData.sessionTypes.reduce(
			(acc, type) => {
				acc[type.id] = {
					id: type.id,
					name: type.name,
					description: type.description || "",
				};
				return acc;
			},
			{} as Record<string, { id: string; name: string; description: string }>,
		);
	}, [sessionsData]);

	// Transform sessions data for current week, filtered by selected types
	const SCHEDULE = useMemo(() => {
		if (!sessionsData?.sessionsByDate) return [];

		// Group sessions by day of week for the current week
		const weekSchedule: Record<
			number,
			Array<{
				id: string;
				typeId: string;
				typeName: string;
				startTime: string;
				endTime: string;
				isPrivate: boolean;
				date: string;
			}>
		> = {};

		dates.forEach((date) => {
			const dateStr = formatDateISO(date);
			const dayOfWeek = date.getDay();
			const daySessions = sessionsData.sessionsByDate[dateStr] || [];

			// Filter out past sessions - only show sessions that haven't started yet
			const now = new Date();
			const todayStr = formatDateISO(now);
			const isToday = dateStr === todayStr;

			// Filter by selected session types (if any selected) and exclude past sessions
			const filteredSessions = daySessions.filter((session) => {
				// Filter by session type if filters are selected
				if (selectedFilters.size > 0 && !selectedFilters.has(session.typeId)) {
					return false;
				}

				// If this is today, check if the session start time has passed
				if (isToday) {
					const [hours, minutes] = session.startTime.split(":").map(Number);
					const sessionStartTime = new Date(now);
					sessionStartTime.setHours(hours, minutes, 0, 0);

					// Only include sessions that haven't started yet
					return sessionStartTime > now;
				}

				// For future dates, include all sessions
				return true;
			});

			if (filteredSessions.length > 0) {
				if (!weekSchedule[dayOfWeek]) {
					weekSchedule[dayOfWeek] = [];
				}
				filteredSessions.forEach((session) => {
					weekSchedule[dayOfWeek].push({
						id: session.id,
						typeId: session.typeId,
						typeName: session.typeName,
						startTime: formatTime(session.startTime),
						endTime: formatTime(session.endTime),
						isPrivate: session.isPrivate,
						date: dateStr,
					});
				});
			}
		});

		// Convert to array format
		return Object.entries(weekSchedule).map(([dayOfWeekStr, sessions]) => ({
			dayOfWeek: parseInt(dayOfWeekStr, 10),
			sessions,
		}));
	}, [sessionsData, dates, selectedFilters]);

	// Toggle session type filter
	const toggleFilter = (typeId: string) => {
		setSelectedFilters((prev) => {
			const newFilters = new Set(prev);
			if (newFilters.has(typeId)) {
				newFilters.delete(typeId);
			} else {
				newFilters.add(typeId);
			}
			return newFilters;
		});
	};

	// Navigate weeks
	const goToPreviousWeek = () => {
		setCurrentWeekOffset((prev) => Math.max(0, prev - 1));
	};

	const goToNextWeek = () => {
		setCurrentWeekOffset((prev) => prev + 1);
	};

	const goToCurrentWeek = () => {
		setCurrentWeekOffset(0);
	};

	// Map day of week to schedule
	const scheduleByDay = useMemo(() => {
		const map = new Map<number, (typeof SCHEDULE)[0]>();
		SCHEDULE.forEach((day) => {
			map.set(day.dayOfWeek, day);
		});
		return map;
	}, [SCHEDULE]);

	// Reorder to start from Monday
	const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun

	// Loading state
	if (loading) {
		return (
			<div className="py-24">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl text-center">
					<div className="w-24 h-24 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
						<svg
							className="w-12 h-12 text-gray-600 animate-spin"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
					<h1 className="font-display text-4xl text-white tracking-wide mb-4">
						LOADING SCHEDULE...
					</h1>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="py-24">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl text-center">
					<h1 className="font-display text-4xl text-white tracking-wide mb-4">
						ERROR LOADING SCHEDULE
					</h1>
					<p className="text-gray-400 mb-8">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="btn-lime text-sm font-semibold tracking-widest uppercase">
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Page Header */}
			<section className="py-8 sm:py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
					{/* Month/Year Display */}
					<div className="mt-4 text-center">
						<p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-lime tracking-widest uppercase">
							{MONTH_NAMES[monday.getMonth()]} {monday.getFullYear()}
						</p>
					</div>
				</div>
			</section>

			{/* Session Type Legend & Filters - Sticky Top Bar */}
			<section className="sticky top-0 z-10 py-3 sm:py-4 bg-[#0a0a0a]">
				<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl">
					<div className="flex flex-col gap-5">
						{Object.values(SESSION_TYPES).length > 0 && (
							<div className="flex flex-col gap-3">
								<p className="text-gray-500 text-xs text-center uppercase tracking-wide">
									Filter by Class Type
								</p>
								<div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
									{Object.values(SESSION_TYPES).map((type) => {
										const typeNameLower = type.name.toLowerCase();
										const isPowerPlay = typeNameLower.includes("power");
										const isCardio = typeNameLower.includes("cardio");
										const isEngine = typeNameLower.includes("engine");
										const isMum = typeNameLower.includes("mum");

										let colorClass = "bg-blue-500";
										if (isPowerPlay) colorClass = "bg-lime";
										else if (isCardio) colorClass = "bg-red-500";
										else if (isEngine) colorClass = "bg-purple-500";
										else if (isMum) colorClass = "bg-pink-500";

										const isSelected =
											selectedFilters.size === 0 ||
											selectedFilters.has(type.id);

										return (
											<button
												key={type.id}
												onClick={() => toggleFilter(type.id)}
												className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${
													isSelected ?
														"bg-[#1a1a1a] border-lime"
													:	"bg-[#0f0f0f] border-gray-800 opacity-60"
												}`}>
												<div
													className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 ${colorClass}`}
												/>
												<span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
													{type.name}
												</span>
												<span className="text-gray-500 text-[10px] sm:text-xs hidden sm:inline">
													£{SESSION_PRICE}
												</span>
											</button>
										);
									})}
									{selectedFilters.size > 0 && (
										<button
											onClick={() => setSelectedFilters(new Set())}
											className="px-3 py-1.5 text-gray-400 text-xs hover:text-white transition-colors">
											Clear Filters
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			<section>
				{/* Week Navigation */}
				<div className="flex justify-center gap-2 sm:gap-3 w-full md:w-auto my-4">
					<button
						onClick={goToPreviousWeek}
						disabled={currentWeekOffset === 0}
						className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1a1a1a] border border-lime rounded-lg text-white text-xs sm:text-sm font-semibold hover:border-lime disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
						<span className="hidden sm:inline">← </span>Prev
					</button>
					{currentWeekOffset > 0 && (
						<button
							onClick={goToCurrentWeek}
							className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black border border-gray-800 rounded-lg text-white text-xs sm:text-sm font-semibold hover:bg-lime/30 transition-colors">
							Today
						</button>
					)}
					<button
						onClick={goToNextWeek}
						className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1a1a1a] border border-lime rounded-lg text-white text-xs sm:text-sm font-semibold hover:border-lime transition-colors">
						Next<span className="hidden sm:inline"> Week →</span>
					</button>
				</div>
			</section>

			{/* Schedule Grid */}
			<section className="py-8 md:py-12">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl ">
					<div className="space-y-0">
						{orderedDays.map((dayOfWeek, index) => {
							const daySchedule = scheduleByDay.get(dayOfWeek);
							const date = dates[index];
							const isRestDay =
								!daySchedule || daySchedule.sessions.length === 0;

							return (
								<div
									key={dayOfWeek}
									className={`py-4 sm:py-6 md:py-8 lg:py-10 ${index < 6 ? "border-b border-gray-900" : ""}`}>
									<div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-12 lg:gap-16 items-start">
										{/* Day Header - Sticky on large screens */}
										<div className="w-full sm:w-20 md:w-24 lg:w-28 shrink-0 sm:sticky sm:top-20 lg:top-24 self-start">
											<div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
												<p className="day-name text-base sm:text-sm md:text-base font-semibold">
													{DAY_NAMES[dayOfWeek]}
												</p>
												<p className="day-number text-3xl sm:text-2xl md:text-3xl lg:text-4xl">
													{date.getDate()}
												</p>
												<div className="flex sm:flex-col gap-1 sm:gap-0">
													<p className="text-gray-500 text-xs mt-1">
														{MONTH_NAMES[date.getMonth()].slice(0, 3)}{" "}
														{date.getFullYear()}
													</p>
													<p className="text-gray-400 text-xs mt-0.5 font-medium hidden sm:block">
														{date.toLocaleDateString("en-GB", {
															day: "numeric",
															month: "long",
														})}
													</p>
												</div>
											</div>
										</div>

										{/* Sessions Container */}
										<div className="flex-1 min-w-0 w-full flex justify-center sm:justify-start">
											{isRestDay ?
												<div className="py-8 text-center">
													<p className="text-gray-600 text-sm tracking-wide uppercase">
														Rest Day
													</p>
												</div>
											:	<div className="space-y-6 w-full max-w-md sm:max-w-none">
													{/* Group sessions by type */}
													{Object.values(
														daySchedule!.sessions.reduce(
															(acc, session) => {
																if (!acc[session.typeName]) {
																	acc[session.typeName] = [];
																}
																acc[session.typeName].push(session);
																return acc;
															},
															{} as Record<string, typeof daySchedule.sessions>,
														),
													).map((sessionGroup) => {
														const sessionTypeName =
															sessionGroup[0].typeName.toLowerCase();
														const isPowerPlay =
															sessionTypeName.includes("power");
														const isCardio = sessionTypeName.includes("cardio");
														const isEngine = sessionTypeName.includes("engine");
														const isMum = sessionTypeName.includes("mum");

														let colorClass = "bg-blue-500";
														if (isPowerPlay) colorClass = "bg-lime";
														else if (isCardio) colorClass = "bg-red-500";
														else if (isEngine) colorClass = "bg-purple-500";
														else if (isMum) colorClass = "bg-pink-500";

														return (
															<div
																key={sessionGroup[0].typeName}
																className="space-y-3">
																{/* Session Type Header */}
																<div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
																	<div
																		className={`w-2 h-2 rounded-full ${colorClass}`}
																	/>
																	<h3 className="program-name text-lg md:text-xl font-semibold">
																		{sessionGroup[0].typeName}
																	</h3>
																	<span className="text-gray-500 text-xs">
																		{sessionGroup.length} session
																		{sessionGroup.length !== 1 ? "s" : ""}
																	</span>
																</div>

																{/* Sessions Grid - Better organized */}
																<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 w-full">
																	{sessionGroup.map((session) => (
																		<SessionCard
																			key={`${session.id}-${session.date}`}
																			sessionId={session.id}
																			sessionTypeId={session.typeId}
																			sessionTypeName={session.typeName}
																			date={session.date}
																			dayOfWeek={dayOfWeek}
																			startTime={session.startTime}
																			endTime={session.endTime}
																			price={SESSION_PRICE}
																			isPrivate={session.isPrivate}
																		/>
																	))}
																</div>
															</div>
														);
													})}
												</div>
											}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Session Types Info - Collapsible/Compact */}
			<section className="py-8 sm:py-12 border-t border-gray-900 bg-[#111111]">
				<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
					<div className="flex items-center justify-center mb-6 sm:mb-8">
						<div className="triple-lines">
							<span></span>
						</div>
						<h2 className="font-display text-xl sm:text-2xl md:text-3xl text-white tracking-wide">
							ABOUT OUR CLASSES
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
						{Object.values(SESSION_TYPES).length > 0 ?
							Object.values(SESSION_TYPES).map((type) => {
								const typeNameLower = type.name.toLowerCase();
								const isPowerPlay = typeNameLower.includes("power");
								const isCardio = typeNameLower.includes("cardio");
								const isEngine = typeNameLower.includes("engine");
								const isMum = typeNameLower.includes("mum");

								let colorClass = "bg-blue-500";
								if (isPowerPlay) colorClass = "bg-lime";
								else if (isCardio) colorClass = "bg-red-500";
								else if (isEngine) colorClass = "bg-purple-500";
								else if (isMum) colorClass = "bg-pink-500";

								let category = "Functional Fitness";
								if (isPowerPlay) category = "Power Training";
								else if (isCardio) category = "Cardio";
								else if (isEngine) category = "Conditioning";
								else if (isMum) category = "Mum Club";

								return (
									<div
										key={type.id}
										className="card-rounded-lg card-glow p-4 sm:p-6 hover:border-lime/50 transition-colors">
										<div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
											<div
												className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${colorClass}`}
											/>
											<h3 className="program-name text-base sm:text-lg md:text-xl text-lime">
												{type.name}
											</h3>
										</div>
										<p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
											{type.description || "High-quality training session"}
										</p>
										<div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-800">
											<span className="text-lime font-semibold text-sm">
												£{SESSION_PRICE} per session
											</span>
											<span className="text-gray-500 text-xs">{category}</span>
										</div>
									</div>
								);
							})
						:	<div className="text-gray-500 text-sm text-center col-span-2">
								No session types available
							</div>
						}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 border-t border-gray-900">
				<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
					<div className="text-center">
						<div className="flex items-center justify-center mb-6">
							<div className="triple-lines">
								<span></span>
							</div>
							<h2 className="font-display text-4xl text-white tracking-wide">
								READY TO TRAIN?
							</h2>
						</div>
						<p className="text-gray-400 mb-8 max-w-xl mx-auto">
							Select your sessions above and proceed to checkout. New here? Book
							a free consultation first.
						</p>
						<a
							href="/book-consultation"
							className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase">
							Book Free Consultation
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
