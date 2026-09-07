"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	CheckCircleIcon,
	EyeClosedIcon,
	EyeIcon,
	KeyIcon,
	LockIcon,
} from "@phosphor-icons/react"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"

const schema = z
	.object({
		password: z.string().min(8, "Use at least 8 characters"),
		confirm: z.string(),
	})
	.refine((d) => d.password === d.confirm, {
		message: "Passwords don\u2019t match",
		path: ["confirm"],
	})

type FormValues = z.infer<typeof schema>

export function ResetPasswordForm() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [done, setDone] = useState(false)

	useEffect(() => {
		// Mid-flow guard: only allow entry if email + otpVerified are set.
		const verified = sessionStorage.getItem("otpVerified")
		if (!verified) router.replace("/forgot-password")
	}, [router])

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: { password: "", confirm: "" },
	})

	const onSubmit = handleSubmit(() => {
		setTimeout(() => {
			sessionStorage.removeItem("resetEmail")
			sessionStorage.removeItem("otpVerified")
			setDone(true)
		}, 600)
	})

	if (done) {
		return (
			<AuthShell>
				<div className="space-y-6 text-center">
					<div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
						<CheckCircleIcon weight="fill" className="size-8" />
					</div>
					<div className="space-y-2">
						<h1 className="font-bold text-2xl tracking-tight">
							Password updated
						</h1>
						<p className="text-muted-foreground text-sm">
							You can now sign in with your new password.
						</p>
					</div>
					<Button
						className="w-full rounded-full"
						size="lg"
						render={<Link href="/signin" />}
						nativeButton={false}
					>
						Back to sign in
					</Button>
				</div>
			</AuthShell>
		)
	}

	return (
		<AuthShell>
			<form onSubmit={onSubmit} noValidate className="space-y-6">
				<header className="space-y-2">
					<h1 className="font-bold text-2xl tracking-tight">
						Set a new password
					</h1>
					<p className="text-muted-foreground text-sm">
						Choose something strong. You&apos;ll use this to sign in from
						now on.
					</p>
				</header>

				<Field label="New password" error={errors.password?.message}>
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
								{showPassword ? <EyeClosedIcon /> : <EyeIcon />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</Field>

				<Field label="Confirm new password" error={errors.confirm?.message}>
					<InputGroup>
						<InputGroupInput
							type={showConfirm ? "text" : "password"}
							placeholder="Type it again"
							autoComplete="new-password"
							aria-invalid={!!errors.confirm}
							{...register("confirm")}
						/>
						<InputGroupAddon align="inline-start">
							<KeyIcon />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-xs"
								aria-label={
									showConfirm ? "Hide password" : "Show password"
								}
								aria-pressed={showConfirm}
								onClick={() => setShowConfirm((prev) => !prev)}
							>
								{showConfirm ? <EyeClosedIcon /> : <EyeIcon />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</Field>

				<Button
					className="w-full rounded-full"
					size="lg"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Updating\u2026" : "Update password"}
				</Button>
			</form>
		</AuthShell>
	)
}
