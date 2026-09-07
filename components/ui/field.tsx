import * as React from "react"

import { cn } from "@/lib/utils"

type FieldProps = {
	label: string
	error?: string
	hint?: string
	children: React.ReactNode
	className?: string
}

export function Field({ label, error, hint, children, className }: FieldProps) {
	return (
		<div className={cn("space-y-1.5", className)}>
			<label className="font-medium text-foreground text-xs leading-none">
				{label}
			</label>
			{children}
			{error ? (
				<p role="alert" className="text-destructive text-xs">
					{error}
				</p>
			) : hint ? (
				<p className="text-muted-foreground text-xs">{hint}</p>
			) : null}
		</div>
	)
}
