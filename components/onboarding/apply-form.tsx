"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	EnvelopeIcon,
	EyeClosedIcon,
	EyeIcon,
	LockIcon,
	PhoneIcon,
	StorefrontIcon,
} from "@phosphor-icons/react"

import { OnboardingShell } from "@/components/onboarding-shell"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { Button } from "@/components/ui/button"
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
		<OnboardingShell backHref="/" backLabel="Home">
			<form className="space-y-6" onSubmit={onSubmit} noValidate>
				<div className="flex flex-col items-start gap-3">
					<OnboardingStepper current={1} />
					<div className="space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							Apply as a Caterer
						</h1>
						<p className="text-muted-foreground">
							Tell us how to reach your business. Hosts will use these details
							to contact you.
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<Field
						label="Business name"
						error={errors.businessName?.message}
					>
						<InputGroup>
							<InputGroupInput
								placeholder="e.g. Sahara Catering"
								autoComplete="organization"
								aria-invalid={!!errors.businessName}
								{...register("businessName")}
							/>
							<InputGroupAddon align="inline-start">
								<StorefrontIcon />
							</InputGroupAddon>
						</InputGroup>
					</Field>

					<Field label="Business email" error={errors.businessEmail?.message}>
						<InputGroup>
							<InputGroupInput
								type="email"
								placeholder="you@business.com"
								autoComplete="email"
								aria-invalid={!!errors.businessEmail}
								{...register("businessEmail")}
							/>
							<InputGroupAddon align="inline-start">
								<EnvelopeIcon />
							</InputGroupAddon>
						</InputGroup>
					</Field>

					<Field
						label="Phone hosts will call"
						error={errors.phone?.message}
					>
						<InputGroup>
							<InputGroupInput
								type="tel"
								placeholder="+1 555 123 4567"
								autoComplete="tel"
								aria-invalid={!!errors.phone}
								{...register("phone")}
							/>
							<InputGroupAddon align="inline-start">
								<PhoneIcon />
							</InputGroupAddon>
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
							<InputGroupAddon align="inline-start">
								<LockIcon />
							</InputGroupAddon>
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
					className="w-full"
					size="lg"
					type="submit"
					disabled={isSubmitting}
				>
					Continue
				</Button>
			</form>
		</OnboardingShell>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: React.ReactNode
}) {
	return (
		<div className="space-y-1.5">
			<Label>{label}</Label>
			{children}
			{error ? (
				<p role="alert" className="text-destructive text-xs">
					{error}
				</p>
			) : null}
		</div>
	)
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<label className="font-medium text-foreground text-xs leading-none">
			{children}
		</label>
	)
}
