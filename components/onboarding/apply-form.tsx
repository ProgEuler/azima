"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	EyeClosedIcon,
	EyeIcon,
} from "@phosphor-icons/react"

import { OnboardingShell } from "@/components/onboarding-shell"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"

const schema = z.object({
	businessName: z.string().min(2, "Business name is required"),
	businessEmail: z.string().email("Email must be valid"),
	phone: z
		.string()
		.min(7, "Phone number is required")
		.regex(/^[0-9+()\-\s]+$/u, "Phone number must be valid"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export function ApplyForm() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			businessName: "",
			businessEmail: "",
			phone: "",
			password: "",
		},
	})

	const onSubmit = handleSubmit(() => {
		router.push("/onboarding/kitchen")
	})

	return (
		<OnboardingShell>
			<form className="space-y-8" onSubmit={onSubmit} noValidate>
				<div className="flex flex-col items-start gap-4">
					<OnboardingStepper current={1} />
					<div className="space-y-2">
						<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
							Apply as a caterer
						</h1>
						<p className="text-muted-foreground text-sm sm:text-base">
							First, the account you will sign in with. Nothing is
							visible to hosts until azima approves your business.
						</p>
					</div>
				</div>

				{/* 2-column grid */}
				<div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
					<Field
						label="Business name"
						error={errors.businessName?.message}
					>
						<InputGroup>
							<InputGroupInput
								placeholder="Yummy Catering"
								autoComplete="organization"
								aria-invalid={!!errors.businessName}
								{...register("businessName")}
							/>
						</InputGroup>
					</Field>

					<Field label="Business email" error={errors.businessEmail?.message}>
						<InputGroup>
							<InputGroupInput
								type="email"
								placeholder="kitchen@yourbusiness.com"
								autoComplete="email"
								aria-invalid={!!errors.businessEmail}
								{...register("businessEmail")}
							/>
						</InputGroup>
					</Field>

					<Field
						label="Phone hosts will call"
						error={errors.phone?.message}
						hint="Shown to a host once you accept their request."
					>
						<InputGroup>
							<InputGroupInput
								type="tel"
								placeholder="+961 3 000 000"
								autoComplete="tel"
								aria-invalid={!!errors.phone}
								{...register("phone")}
							/>
						</InputGroup>
					</Field>

					<Field label="Password" error={errors.password?.message}>
						<InputGroup>
							<InputGroupInput
								type={showPassword ? "text" : "password"}
								placeholder="At least 8 characters"
								autoComplete="new-password"
								aria-invalid={!!errors.password}
								{...register("password")}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									type="button"
									variant="ghost"
									size="icon-xs"
									aria-label={
										showPassword ? "Hide password" : "Show password"
									}
									aria-pressed={showPassword}
									onClick={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? (
										<EyeClosedIcon />
									) : (
										<EyeIcon />
									)}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</Field>
				</div>

				<Button
					className="w-full rounded-full"
					size="lg"
					type="submit"
					disabled={isSubmitting}
				>
					Continue
				</Button>

				<p className="text-center text-sm text-muted-foreground">
					Already approved?{" "}
					<Button
						variant="link"
						className="h-auto p-0 text-sm font-semibold text-foreground"
						render={<Link href="/signin" />}
						nativeButton={false}
					>
						Sign in
					</Button>
				</p>
			</form>
		</OnboardingShell>
	)
}
