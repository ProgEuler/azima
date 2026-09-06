import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { CaretLeftIcon } from "@phosphor-icons/react"

import trianglesSvg from "@/assets/svgs/triangles.svg"

type OnboardingShellProps = {
	children: ReactNode
	backHref?: string
	backLabel?: string
}

export function OnboardingShell({
	children,
	backHref = "/",
	backLabel = "Home",
}: OnboardingShellProps) {
	return (
		<main className="relative min-h-screen overflow-hidden">
			{/* Decorative triangles behind everything */}
			<Image
				src={trianglesSvg}
				alt=""
				fill
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
			/>
			<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

			{/* Top-left: back button + logo */}
			<div className="relative z-10 absolute top-7 left-5 flex items-center gap-3">
				<Button
					variant="ghost"
					render={<Link href={backHref} />}
					nativeButton={false}
				>
					<CaretLeftIcon data-icon="inline-start" />
					{backLabel}
				</Button>
				<Logo className="h-4.5" />
			</div>

			{/* Centered content */}
			<div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center px-6 py-20 sm:max-w-lg">
				{children}
			</div>
		</main>
	)
}
