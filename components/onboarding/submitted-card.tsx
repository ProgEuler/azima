"use client"

import Link from "next/link"
import { CheckCircleIcon, ClockClockwiseIcon } from "@phosphor-icons/react"

import { OnboardingShell } from "@/components/onboarding-shell"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export function SubmittedCard() {
	return (
		<OnboardingShell backHref="/" backLabel="Home">
			<div className="flex flex-col items-center gap-4 text-center">
				<OnboardingStepper current={3} />
				<div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
					<CheckCircleIcon weight="fill" className="size-8" />
				</div>
				<div className="space-y-1">
					<h1 className="font-bold text-2xl tracking-wide">
						Application submitted
					</h1>
					<p className="text-muted-foreground">
						Azima reviews your business.
					</p>
				</div>
			</div>

			<Card className="border-foreground/10 bg-card/60">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ClockClockwiseIcon className="size-4 text-muted-foreground" />
						What happens next
					</CardTitle>
					<CardDescription>
						Most applications are reviewed within 1–2 business days.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-muted-foreground">
					<ol className="space-y-2 text-sm">
						<li className="flex gap-3">
							<span
								aria-hidden
								className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs"
							>
								1
							</span>
							<span>
								We&apos;ll review your kitchen details and verify your
								contact information.
							</span>
						</li>
						<li className="flex gap-3">
							<span
								aria-hidden
								className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs"
							>
								2
							</span>
							<span>
								You&apos;ll receive an email at the address you provided
								once the review is complete.
							</span>
						</li>
						<li className="flex gap-3">
							<span
								aria-hidden
								className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs"
							>
								3
							</span>
							<span>
								Approved caterers can be listed on Azima and start receiving
								booking requests.
							</span>
						</li>
					</ol>
				</CardContent>
				<CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
					<Button
						variant="outline"
						render={<Link href="/" />}
						nativeButton={false}
					>
						Back to home
					</Button>
					<Button
						render={<Link href="/" />}
						nativeButton={false}
					>
						View status
					</Button>
				</CardFooter>
			</Card>
		</OnboardingShell>
	)
}
