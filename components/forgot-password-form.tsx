"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EnvelopeIcon } from "@phosphor-icons/react"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { FormError } from "@/components/form-error"
import { authApi } from "@/lib/api/auth"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group"

const schema = z.object({
	email: z.string().email("Email must be valid"),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
	const router = useRouter()
	const [submitError, setSubmitError] = useState<unknown>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: { email: "" },
	})

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError(null)
		try {
			await authApi.forgotPassword(values.email)
			sessionStorage.setItem("resetEmail", values.email)
			sessionStorage.removeItem("resetOtp")
			router.push("/verify-otp")
		} catch (error) {
			setSubmitError(error)
		}
	})

	return (
		<AuthShell backHref="/signin" backLabel="Back to sign in">
			<form onSubmit={onSubmit} noValidate className="space-y-6">
				<header className="space-y-2">
					<h1 className="font-bold text-2xl tracking-tight">
						Forgot your password?
					</h1>
					<p className="text-muted-foreground text-sm">
						Enter the email on your account and we&apos;ll send you a
						6-digit code to reset your password.
					</p>
				</header>

				<FormError error={submitError} />
				<Field label="Email" error={errors.email?.message}>
					<InputGroup>
						<InputGroupInput
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							aria-invalid={!!errors.email}
							{...register("email")}
						/>
						<InputGroupAddon align="inline-start">
							<EnvelopeIcon />
						</InputGroupAddon>
					</InputGroup>
				</Field>

				<Button
					className="w-full rounded-full"
					size="lg"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Sending\u2026" : "Send reset code"}
				</Button>

				<p className="text-center text-muted-foreground text-sm">
					Remembered it?{" "}
					<Button
						variant="link"
						className="h-auto p-0 font-semibold text-foreground text-sm"
						render={<Link href="/signin" />}
						nativeButton={false}
					>
						Back to sign in
					</Button>
				</p>
			</form>
		</AuthShell>
	)
}
