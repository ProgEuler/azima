"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircleIcon, ClockClockwiseIcon } from "@phosphor-icons/react"

import { useAuth, homeFor } from "@/components/auth-provider"
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
	const { user, status, refreshUser, signOut } = useAuth()
	const [checking, setChecking] = useState(false)
	const approved = Boolean(user?.is_approved)
	const rejected = user?.application_status === "rejected"

	const checkStatus = async () => {
		setChecking(true)
		await refreshUser()
		setChecking(false)
	}

	return (
		<OnboardingShell>
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
					<CheckCircleIcon weight="fill" className="size-8" />
				</div>
				<div className="space-y-1">
					<h1 className="font-bold text-2xl tracking-wide">
						{approved
							? "You're approved"
							: rejected
								? "Application not approved"
								: "Application submitted"}
					</h1>
					<p className="text-muted-foreground">
						{approved
							? "Your kitchen is live on Azima. You can start receiving requests."
							: rejected
								? user?.rejection_reason ||
									"Unfortunately we could not approve your application."
								: "Thank you for your application. We will review it shortly."}
					</p>
				</div>
			</div>

			<div className="mt-8 w-full">
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
					{status === "authenticated" ? (
						<Button variant="outline" onClick={() => void signOut()}>
							Sign out
						</Button>
					) : (
						<Button
							variant="outline"
							render={<Link href="/signin" />}
							nativeButton={false}
						>
							Sign in
						</Button>
					)}
					{approved && user ? (
						<Button
							render={<Link href={homeFor(user)} />}
							nativeButton={false}
						>
							Go to dashboard
						</Button>
					) : (
						<Button
							onClick={checkStatus}
							disabled={checking || status !== "authenticated"}
						>
							{checking ? "Checking…" : "View status"}
						</Button>
					)}
				</CardFooter>
			</div>
		</OnboardingShell>
	)
}
