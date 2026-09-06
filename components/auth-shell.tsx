import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { CaretLeftIcon } from "@phosphor-icons/react"

import recipesImage from "@/assets/images/recipes.png"
import trianglesSvg from "@/assets/svgs/triangles.svg"

type AuthShellProps = {
	children: ReactNode
	backHref?: string
	backLabel?: string
	showMobileLogo?: boolean
}

export function AuthShell({
	children,
	backHref = "/",
	backLabel = "Home",
	showMobileLogo = true,
}: AuthShellProps) {
	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			{/* Full-bleed decorative SVG behind everything */}
			<Image
				src={trianglesSvg}
				alt=""
				fill
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
			/>

			{/* LEFT PANEL — image + logo, hidden on mobile */}
			<div className="relative hidden h-full flex-col overflow-hidden border-r p-10 lg:flex dark:bg-secondary/20">
				<Image
					src={recipesImage}
					alt="Catering dishes"
					fill
					priority
					className="object-cover object-center"
				/>
				<Image
					src={trianglesSvg}
					alt=""
					fill
					aria-hidden
					className="pointer-events-none object-contain object-center opacity-50"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
				<Logo full size="lg" />
			</div>

			{/* RIGHT PANEL */}
			<div className="relative flex min-h-screen flex-col justify-center px-8">
				<Button
					className="absolute top-7 left-5"
					variant="ghost"
					render={<Link href={backHref} />}
					nativeButton={false}
				>
					<CaretLeftIcon data-icon="inline-start" />
					{backLabel}
				</Button>

				<div className="mx-auto w-full space-y-6 sm:w-sm">
					{showMobileLogo && <Logo className="h-4.5 lg:hidden" />}
					{children}
				</div>
			</div>
		</main>
	)
}
