"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EnvelopeIcon } from "@phosphor-icons/react"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
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

	const onSubmit = handleSubmit((values) => {
		sessionStorage.setItem("resetEmail", values.email)
		setTimeout(() => router.push("/verify-otp"), 600)
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
