"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookConsultation() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		date: "",
		time: "",
		hasInjuries: "no",
		injuries: "",
	});
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
		if (date) {
			// Format date as YYYY-MM-DD for form submission
			const formattedDate = date.toISOString().split("T")[0];
			setFormData({
				...formData,
				date: formattedDate,
			});
		} else {
			setFormData({
				...formData,
				date: "",
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Example API call - replace with your actual endpoint
		try {
			const response = await fetch("/api/bookings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmitted(true);
				setFormData({
					name: "",
					email: "",
					phone: "",
					date: "",
					time: "",
					hasInjuries: "no",
					injuries: "",
				});
				setSelectedDate(null);
				setTimeout(() => setSubmitted(false), 3000);
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="section-padding-lg">
			<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-2xl">
				<h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-12 text-center	">
					Book Your Consultation
				</h1>

				<div className="card-rounded-lg p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="name" className="block text-gray-400 mb-2">
								Full Name *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-gray-400 mb-2">
								Email *
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
							/>
						</div>

						<div>
							<label htmlFor="phone" className="block text-gray-400 mb-2">
								Phone Number *
							</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
							/>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label htmlFor="date" className="block text-gray-400 mb-2">
									Preferred Date *
								</label>
								<DatePicker
									id="date"
									selected={selectedDate}
									onChange={handleDateChange}
									dateFormat="dd/MM/yyyy"
									placeholderText="dd/mm/yyyy"
									required
									minDate={new Date()}
									className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
									wrapperClassName="w-full"
								/>
							</div>

							<div>
								<label htmlFor="time" className="block text-gray-400 mb-2">
									Preferred Time *
								</label>
								<select
									id="time"
									name="time"
									value={formData.time}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-gray-400 focus:border-lime focus:outline-none transition-colors">
									<option value="">Select a time</option>
									<option value="morning">Morning (06:00 - 12:00)</option>
									<option value="afternoon">Afternoon (12:00 - 18:00)</option>
									<option value="evening">Evening (18:00 - 21:00)</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-gray-400 mb-4">
								Do you have any injuries or limitations? *
							</label>
							<div className="flex gap-6">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="hasInjuries"
										value="no"
										checked={formData.hasInjuries === "no"}
										onChange={handleChange}
										className="w-4 h-4 "
									/>
									<span className="text-white">No</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="hasInjuries"
										value="yes"
										checked={formData.hasInjuries === "yes"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-white">Yes</span>
								</label>
							</div>
						</div>

						{formData.hasInjuries === "yes" && (
							<div>
								<label htmlFor="injuries" className="block text-gray-400 mb-2">
									Please describe your injuries or limitations
								</label>
								<textarea
									id="injuries"
									name="injuries"
									value={formData.injuries}
									onChange={handleChange}
									rows={4}
									className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors resize-none"
								/>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white text-sm font-semibold tracking-widest uppercase hover:bg-lime-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
							{loading ? "BOOKING..." : "BOOK CONSULTATION"}
						</button>

						{submitted && (
							<p className="text-lime text-center">
								Consultation booked successfully!
							</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
