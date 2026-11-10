import { cn } from "@/lib/utils"
import {
	TONE_CLASSES,
	orderStatusLabel,
	orderStatusTone,
} from "@/lib/order-meta"

export function OrderStatusPill({
	status,
	className,
}: {
	status: string
	className?: string
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
				TONE_CLASSES[orderStatusTone(status)],
				className,
			)}
		>
			{orderStatusLabel(status)}
		</span>
	)
}
