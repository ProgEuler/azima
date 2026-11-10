import Image from "next/image"
import { mediaUrl } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import { initials } from "@/lib/format"

/**
 * Square/tile image for API media with an initials fallback when the
 * caterer or dish has no picture yet. The parent controls the size.
 */
export function MediaThumb({
	src,
	label,
	fallbackSrc,
	sizes = "56px",
	className,
	priority,
}: {
	src: string | null | undefined
	label: string
	/** Static artwork shown when there is no uploaded picture. */
	fallbackSrc?: string
	sizes?: string
	className?: string
	priority?: boolean
}) {
	const resolved = mediaUrl(src) ?? fallbackSrc ?? null
	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden border border-[#EFECE6] bg-stone-100 shadow-2xs dark:border-stone-700 dark:bg-stone-800",
				className,
			)}
		>
			{resolved ? (
				<Image
					src={resolved}
					alt={label}
					fill
					sizes={sizes}
					priority={priority}
					className="object-cover"
				/>
			) : (
				<div className="flex size-full items-center justify-center bg-[#FBF0EB] font-bold text-[#A3432B] text-xs dark:bg-amber-950/40 dark:text-amber-400">
					{initials(label)}
				</div>
			)}
		</div>
	)
}
