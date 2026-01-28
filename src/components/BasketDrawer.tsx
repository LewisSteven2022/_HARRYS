"use client";

import { useBasketStore, type BasketItem } from "@/store/basket";
import { useEffect, useState } from "react";
import Link from "next/link";

interface BasketDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

export default function BasketDrawer({ isOpen, onClose }: BasketDrawerProps) {
	const [mounted, setMounted] = useState(false);
	const { items, removeItem, clearBasket, getTotal } = useBasketStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!mounted) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 z-50 transform transition-transform ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
						<h2 className="font-display text-xl sm:text-2xl text-white tracking-wide">
							YOUR BASKET
						</h2>
						<button
							onClick={onClose}
							className="p-2 text-gray-400 hover:text-white transition-colors">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Items */}
					<div className="flex-1 overflow-y-auto p-4 sm:p-6">
						{items.length === 0 ?
							<div className="text-center py-8 sm:py-12">
								<svg
									className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-700 mb-3 sm:mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
								<p className="text-gray-500 text-sm sm:text-base">
									Your basket is empty
								</p>
								<p className="text-gray-600 text-xs sm:text-sm mt-2 px-4">
									Add sessions from the schedule to get started
								</p>
							</div>
						:	<ul className="space-y-3 sm:space-y-4">
								{items.map((item) => (
									<BasketItemCard
										key={`${item.sessionId}-${item.date}`}
										item={item}
										onRemove={() => removeItem(item.sessionId, item.date)}
									/>
								))}
							</ul>
						}
					</div>

					{/* Footer */}
					{items.length > 0 && (
						<div className="border-t border-gray-800 p-6 space-y-4">
							<div className="flex justify-between items-center text-lg">
								<span className="text-gray-400">Total</span>
								<span className="font-display text-2xl text-white">
									£{getTotal().toFixed(2)}
								</span>
							</div>

							<Link
								href="/checkout"
								onClick={onClose}
								className="block w-full btn-lime text-center text-sm font-semibold tracking-widest uppercase">
								Checkout
							</Link>

							<button
								onClick={clearBasket}
								className="w-full text-center text-gray-500 text-sm hover:text-gray-300 transition-colors">
								Clear basket
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

function BasketItemCard({
	item,
	onRemove,
}: {
	item: BasketItem;
	onRemove: () => void;
}) {
	return (
		<li className="bg-[#1a1a1a] rounded-lg p-4">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-display text-lg text-lime tracking-wide">
						{item.sessionTypeName}
					</h3>
					<p className="text-gray-400 text-sm mt-1">{formatDate(item.date)}</p>
					<p className="text-gray-500 text-sm">
						{item.startTime} - {item.endTime}
					</p>
				</div>
				<div className="flex items-start gap-3">
					<span className="text-white font-medium">
						£{item.price.toFixed(2)}
					</span>
					<button
						onClick={onRemove}
						className="p-1 text-gray-500 hover:text-red-500 transition-colors"
						aria-label="Remove item">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</li>
	);
}
