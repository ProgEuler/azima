import { notFound } from "next/navigation";

import { AdminProviderDetail } from "@/components/admin/admin-provider-detail";
import { adminCatererProviders } from "@/lib/mock-data";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminProviderDetailPage({ params }: PageProps) {
	const { id } = await params;

	const provider =
		adminCatererProviders.find((p) => p.id === id) ||
		adminCatererProviders.find((p) => p.id === "yummy-catering") ||
		adminCatererProviders[0];

	if (!provider) {
		notFound();
	}

	return (
		<div className="-m-4 md:-m-6 min-h-full p-4 md:p-8 transition-colors">
			<AdminProviderDetail provider={provider} />
		</div>
	);
}
