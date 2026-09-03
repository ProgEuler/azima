"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";
import { CaretLeftIcon, AtIcon } from "@phosphor-icons/react";

export function AuthPage() {
	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
				<Logo className="mr-auto h-4.5" />

			</div>
			<div className="relative flex min-h-screen flex-col justify-center px-8">
				<Button className="absolute top-7 left-5" variant="ghost" render={<a href="#" />} nativeButton={false}><CaretLeftIcon data-icon="inline-start" />Home
                					</Button>

				<div className="mx-auto space-y-4 sm:w-sm">
					<Logo className="h-4.5 lg:hidden" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							Welcome back!
						</h1>
						<p className="text-base text-muted-foreground">
							Sign in with the email your account was opened with.
						</p>
					</div>

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
								<AtIcon
								/>
							</InputGroupAddon>
						</InputGroup>
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Enter your password"
                                type="password"
                            />
                            <InputGroupAddon align="inline-start">
                                <AtIcon
                                />
                            </InputGroupAddon>
                        </InputGroup>

						<Button className="w-full" type="button">
							sign in
						</Button>
					</form>
				</div>
			</div>
		</main>
	);
}
