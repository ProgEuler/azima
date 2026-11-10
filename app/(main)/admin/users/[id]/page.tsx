"use client";

import { use } from "react";

import { AdminUserDetail } from "@/components/admin/admin-user-detail";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default function AdminUserDetailPage({ params }: PageProps) {
	const { id } = use(params);

	return (
		<div className="-m-4 md:-m-6 min-h-full p-4 md:p-8 transition-colors">
			<AdminUserDetail id={id} />
		</div>
	);
}
