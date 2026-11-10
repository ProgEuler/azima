"use client";

import { use } from "react";

import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default function AdminOrderDetailPage({ params }: PageProps) {
	const { id } = use(params);

	return (
		<div className="-m-4 md:-m-6 min-h-full p-4 md:p-8 transition-colors">
			<AdminOrderDetail id={id} />
		</div>
	);
}
