"use client";

import { use } from "react";

import { AdminProviderDetail } from "@/components/admin/admin-provider-detail";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default function AdminProviderDetailPage({ params }: PageProps) {
	const { id } = use(params);

	return (
		<div className="-m-4 md:-m-6 min-h-full p-4 md:p-8 transition-colors">
			<AdminProviderDetail id={id} />
		</div>
	);
}
