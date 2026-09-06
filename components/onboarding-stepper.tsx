import { Badge } from "@/components/ui/badge"

export function OnboardingStepper({ current }: { current: 1 | 2 | 3 }) {
	return (
		<Badge variant="default" className="font-medium tracking-wide">
			Step {current} of 3
		</Badge>
	)
}
