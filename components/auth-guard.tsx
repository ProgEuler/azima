"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { homeFor, useAuth } from "@/components/auth-provider"
import type { PortalRole } from "@/lib/api/auth"

/**
 * Gate for role-scoped layouts. Anonymous visitors go to /signin, signed-in
 * users of the other role go to their own home, and providers still awaiting
 * approval see their application status instead of the dashboard.
 */
export function AuthGuard({
	role,
	children,
}: {
	role: PortalRole
	children: ReactNode
}) {
	const router = useRouter()
	const { user, status } = useAuth()

	const target =
		status === "anonymous"
			? "/signin"
			: user && user.role !== role
				? homeFor(user)
				: user && role === "provider" && !user.is_approved
					? "/onboarding/submitted"
					: null

	useEffect(() => {
		if (target) router.replace(target)
	}, [target, router])

	if (status === "loading" || target || !user) {
		return (
			<div
				role="status"
				aria-label="Loading"
				className="flex min-h-svh items-center justify-center text-muted-foreground text-sm"
			>
				Loading…
			</div>
		)
	}

	return <>{children}</>
}
