"use client";

import { useState, useEffect } from "react";

interface Settings {
	sessionPrice: number;
	currency: string;
}

export default function AdminSettingsPage() {
	const [settings, setSettings] = useState<Settings>({
		sessionPrice: 15,
		currency: "GBP",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			const response = await fetch("/api/admin/settings");
			if (!response.ok) throw new Error("Failed to fetch settings");
			const data = await response.json();
			setSettings(data.config);
		} catch (error) {
			console.error("Error fetching settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const response = await fetch("/api/admin/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(settings),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "Failed to save settings");
				return;
			}

			alert("Settings saved successfully!");
		} catch (error) {
			console.error("Error saving settings:", error);
			alert("Failed to save settings");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="text-white">Loading...</div>;
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2">
					Settings
				</h1>
				<p className="text-gray-400 text-sm sm:text-base">
					Manage site configuration
				</p>
			</div>

			<form
				onSubmit={handleSave}
				className="card-rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
				<div>
					<label className="block text-gray-400 text-xs sm:text-sm mb-2">
						Session Price
					</label>
					<div className="flex items-center gap-2">
						<span className="text-gray-400 text-sm">{settings.currency}</span>
						<input
							type="number"
							step="0.01"
							value={settings.sessionPrice}
							onChange={(e) =>
								setSettings({
									...settings,
									sessionPrice: parseFloat(e.target.value),
								})
							}
							required
							min="0"
							className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label className="block text-gray-400 text-xs sm:text-sm mb-2">
						Currency
					</label>
					<select
						value={settings.currency}
						onChange={(e) =>
							setSettings({ ...settings, currency: e.target.value })
						}
						required
						className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:border-lime focus:outline-none">
						<option value="GBP">GBP (£)</option>
						<option value="USD">USD ($)</option>
						<option value="EUR">EUR (€)</option>
					</select>
				</div>

				<div className="flex gap-3 pt-2 sm:pt-4">
					<button
						type="submit"
						disabled={saving}
						className="btn-lime text-xs sm:text-sm disabled:opacity-50 w-full sm:w-auto">
						{saving ? "Saving..." : "Save Settings"}
					</button>
				</div>
			</form>
		</div>
	);
}
