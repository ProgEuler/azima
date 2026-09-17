import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
	const { id } = await params;
	void id;

	return (
		<div className="-m-4 md:-m-6 min-h-full p-4 md:p-8 transition-colors">
			<AdminOrderDetail />
		</div>
	);
}
