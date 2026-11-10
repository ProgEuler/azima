import { WarningCircleIcon } from "@phosphor-icons/react"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

/** Inline banner for a failed request. Renders nothing when there is no error. */
export function FormError({
	error,
	className,
}: {
	error: unknown
	className?: string
}) {
	if (!error) return null
	const message =
		error instanceof ApiError || error instanceof Error
			? error.message
			: String(error)
	return (
		<div
			role="alert"
			className={cn(
				"flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm",
				className,
			)}
		>
			<WarningCircleIcon className="mt-0.5 size-4 shrink-0" weight="fill" />
			<span>{message}</span>
		</div>
	)
}

/** Loading / failure placeholder shared by data-driven pages. */
export function QueryState({
	loading,
	error,
	onRetry,
	label = "Loading…",
}: {
	loading: boolean
	error: ApiError | null
	onRetry?: () => void
	label?: string
}) {
	if (error) {
		return (
			<div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
				<FormError error={error} />
				{onRetry ? (
					<button
						type="button"
						onClick={onRetry}
						className="rounded-full border px-4 py-1.5 font-semibold text-xs hover:bg-muted"
					>
						Try again
					</button>
				) : null}
			</div>
		)
	}
	if (loading) {
		return (
			<div
				role="status"
				className="py-16 text-center text-muted-foreground text-sm"
			>
				{label}
			</div>
		)
	}
	return null
}
