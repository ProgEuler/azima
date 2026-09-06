"use client"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group"
import { AuthDivider } from "@/components/auth-divider"
import { AtIcon } from "@phosphor-icons/react"

export function AuthPage() {
	return (
		<AuthShell>
			<div className="space-y-4">
				<h1 className="font-bold text-2xl tracking-wide">Welcome back!</h1>
				<p className="text-base text-muted-foreground">
					Sign in with the email your account was opened with.
				</p>

				<AuthDivider>OR</AuthDivider>

				<form className="space-y-2">
					<p className="text-start text-muted-foreground text-xs">
						Enter your email address to sign in or create an account
					</p>
					<InputGroup>
						<InputGroupInput
							placeholder="your.email@example.com"
							type="email"
						/>
						<InputGroupAddon align="inline-start">
							<AtIcon />
						</InputGroupAddon>
					</InputGroup>
					<InputGroup>
						<InputGroupInput
							placeholder="Enter your password"
							type="password"
						/>
						<InputGroupAddon align="inline-start">
							<AtIcon />
						</InputGroupAddon>
					</InputGroup>

					<Button className="w-full" type="button">
						sign in
					</Button>
				</form>
			</div>
		</AuthShell>
	)
}
