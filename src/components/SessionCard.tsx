"use client";

import { useBasketStore } from "@/store/basket";

interface SessionCardProps {
	sessionId: string;
	sessionTypeId: string;
	sessionTypeName: string;
	date: string; // ISO date (YYYY-MM-DD)
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	price: number;
	isPrivate?: boolean;
}

export default function SessionCard({
	sessionId,
	sessionTypeId,
	sessionTypeName,
	date,
	dayOfWeek,
	startTime,
	endTime,
	price,
	isPrivate = false,
}: SessionCardProps) {
	const { addItem, removeItem, isInBasket } = useBasketStore();
	const inBasket = isInBasket(sessionId, date);

	const handleToggle = () => {
		if (inBasket) {
			removeItem(sessionId, date);
		} else {
			addItem({
				sessionId,
				sessionTypeId,
				sessionTypeName,
				date,
				dayOfWeek,
				startTime,
				endTime,
				price,
			});
		}
	};

	if (isPrivate) {
		return (
			<div className="bg-[#1a1a1a]/50 border border-gray-800 rounded-lg p-3 opacity-60">
				<p className="text-gray-500 text-sm">{startTime} - Private Group</p>
			</div>
		);
	}

	// Determine color based on session type name (more flexible than ID)
	const typeNameLower = sessionTypeName.toLowerCase();
	const isPowerPlay = typeNameLower.includes("power");
	const isCardio = typeNameLower.includes("cardio");
	const isEngine = typeNameLower.includes("engine");
	const isMum = typeNameLower.includes("mum");

	let dotColorClass = "bg-blue-500";
	if (inBasket) {
		dotColorClass = "bg-lime";
	} else if (isPowerPlay) {
		dotColorClass = "bg-lime";
	} else if (isCardio) {
		dotColorClass = "bg-red-500";
	} else if (isEngine) {
		dotColorClass = "bg-purple-500";
	} else if (isMum) {
		dotColorClass = "bg-pink-500";
	}

	return (
		<button
			onClick={handleToggle}
			className={`group w-full text-left rounded-lg p-3 sm:p-3.5 md:p-4 transition-all duration-200 ${
				inBasket ?
					"bg-lime/20 border-2 border-lime shadow-lg shadow-lime/20"
				:	"bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 hover:bg-[#222222]"
			}`}>
			<div className="flex items-center justify-between gap-2 sm:gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
						<div
							className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${dotColorClass}`}
						/>
						<p
							className={`text-xs sm:text-sm md:text-base font-semibold ${inBasket ? "text-lime" : "text-white"}`}>
							{startTime}
						</p>
					</div>
					<p className="text-gray-400 text-[10px] sm:text-xs ml-3 sm:ml-4">
						{endTime}
					</p>
				</div>
				<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
					<span
						className={`text-xs sm:text-sm font-medium ${inBasket ? "text-lime" : "text-gray-300"}`}>
						£{price}
					</span>
					<span
						className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
							inBasket ?
								"bg-lime border-lime scale-110"
							:	"border-gray-600 group-hover:border-gray-500"
						}`}>
						{inBasket && (
							<svg
								className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-black"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</span>
				</div>
			</div>
		</button>
	);
}
