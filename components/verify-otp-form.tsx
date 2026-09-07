"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EnvelopeSimpleIcon } from "@phosphor-icons/react"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/ui/otp-input"
import { MOCK_OTP } from "@/lib/auth-mocks"

const schema = z.object({
	code: z
		.string()
		.length(6, "Enter the 6-digit code")
		.refine((v) => v === MOCK_OTP, "Invalid code. Try again."),
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

export function VerifyOtpForm() {
	const router = useRouter()
	const [email] = useState<string | null>(() =>
		typeof window !== "undefined"
			? sessionStorage.getItem("resetEmail")
			: null,
	)
	const [resendCountdown, setResendCountdown] = useState(30)
	const [code, setCode] = useState("")

	useEffect(() => {
		if (!email) router.replace("/forgot-password")
	}, [email, router])

	useEffect(() => {
		if (resendCountdown <= 0) return
		const t = setTimeout(() => setResendCountdown((s) => s - 1), 1000)
		return () => clearTimeout(t)
	}, [resendCountdown])

	const {
		setValue,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: { code: "" },
	})

	const onSubmit = handleSubmit(() => {
		sessionStorage.setItem("otpVerified", "true")
		setTimeout(() => router.push("/reset-password"), 400)
	})

	return (
		<AuthShell>
			<form onSubmit={onSubmit} noValidate className="space-y-6">
				<header className="space-y-2 text-center">
					<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<EnvelopeSimpleIcon
							weight="fill"
							className="size-6"
						/>
					</div>
					<h1 className="font-bold text-2xl tracking-tight">
						Check your email
					</h1>
					<p className="text-muted-foreground text-sm">
						We sent a 6-digit code to{" "}
						{email ? (
							<span className="font-medium text-foreground">
								{email}
							</span>
						) : (
							"your inbox"
						)}
						. It expires in 10 minutes.
					</p>
				</header>

				<OtpInput
					value={code}
					onChange={(v) => {
						setCode(v)
						setValue("code", v, { shouldValidate: false })
					}}
					invalid={!!errors.code}
					aria-label="6-digit verification code"
				/>

				{errors.code?.message ? (
					<p
						role="alert"
						className="text-center text-destructive text-xs"
					>
						{errors.code.message}
					</p>
				) : null}

				<Button
					className="w-full rounded-full"
					size="lg"
					type="submit"
					disabled={isSubmitting || code.length !== 6}
				>
					{isSubmitting ? "Verifying\u2026" : "Verify code"}
				</Button>

				<p className="text-center text-muted-foreground text-sm">
					Didn&apos;t get it?{" "}
					{resendCountdown > 0 ? (
						<span>Resend in {resendCountdown}s</span>
					) : (
						<Button
							variant="link"
							className="h-auto p-0 font-semibold text-foreground text-sm"
							onClick={() => {
								setResendCountdown(30)
								setCode("")
								setValue("code", "", { shouldValidate: false })
							}}
						>
							Resend code
						</Button>
					)}
				</p>
			</form>
		</AuthShell>
	)
}
