import type { ReactNode } from "react"
import Image from "next/image"

import { Logo } from "@/components/logo"

import trianglesSvg from "@/assets/svgs/triangles.svg"

type OnboardingShellProps = {
	children: ReactNode
}

export function OnboardingShell({
	children,
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

				<div className="absolute top-0 left-0 z-10 p-6">
					<Logo size="lg" />
				</div>

			{/* Centered form area */}
			<div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 pt-24 pb-10">
				<div className="w-full max-w-md sm:max-w-lg">
					{children}
				</div>
			</div>
		</main>
	)
}
