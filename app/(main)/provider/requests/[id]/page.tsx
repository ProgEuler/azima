"use client";

import { use } from "react";

import { ProviderOrderDetail } from "@/components/provider/provider-order-detail";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default function ProviderOrderDetailPage({ params }: PageProps) {
	const { id } = use(params);
	return <ProviderOrderDetail id={id} />;
}
