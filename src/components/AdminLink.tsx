"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminLink() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		let mounted = true;

		// Check admin status asynchronously without blocking render
		fetch("/api/admin/stats")
			.then((response) => {
				if (mounted) {
					setIsAdmin(response.ok);
				}
			})
			.catch(() => {
				if (mounted) {
					setIsAdmin(false);
				}
			});

		return () => {
			mounted = false;
		};
	}, []);

	if (!isAdmin) {
		return null;
	}

	return (
		<Link
			href="/admin"
			className="text-xs font-medium tracking-widest text-lime hover:text-lime-dark transition-colors uppercase whitespace-nowrap">
			Admin
		</Link>
	);
}
