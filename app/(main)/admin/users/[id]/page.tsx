import { notFound } from "next/navigation";
import { AdminUserDetail } from "@/components/admin/admin-user-detail";
import { adminHostUsers } from "@/lib/mock-data";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: PageProps) {
	const { id } = await params;

	const user =
		adminHostUsers.find((u) => u.id === id) ||
		adminHostUsers.find((u) => u.id === "omar-naimneh") ||
		adminHostUsers[0];

	if (!user) {
		notFound();
	}

	return (
		<div className="-m-4 md:-m-6 min-h-full bg-[#FAF8F5] dark:bg-[#141210] p-4 md:p-8 transition-colors">
			<AdminUserDetail user={user} />
		</div>
	);
}
