"use client"

import { cn } from "@/lib/utils"

const steps = [
	{ label: "Your account" },
	{ label: "Your kitchen" },
]

export function OnboardingStepper({ current }: { current: 1 | 2 | 3 }) {
	return (
		<nav aria-label="Onboarding progress" className="flex items-center gap-4">
			{steps.map((step, i) => {
				const stepNumber = i + 1
				const isActive = stepNumber === current
				const isCompleted = stepNumber < current

				return (
					<div
						key={stepNumber}
						className={cn(
							"flex items-center gap-1.5 text-xs font-medium",
							isActive || isCompleted
								? "text-foreground"
								: "text-muted-foreground/60"
						)}
					>
						<span
							className={cn(
								"flex size-5 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-semibold",
								isActive || isCompleted
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground/60"
							)}
						>
							{stepNumber}
						</span>
						{step.label}
					</div>
				)
			})}
		</nav>
	)
}
