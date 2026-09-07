"use client"

import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from "@/components/ui/input-group"
import { AuthDivider } from "@/components/auth-divider"
import { AtIcon, KeyIcon } from "@phosphor-icons/react"

export function AuthPage() {
   return (
      <AuthShell>
         <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-wide">Welcome back!</h1>
            <p className="text-base text-muted-foreground">
               Sign in with the email your account was opened with.
            </p>

            <form className="space-y-2">
               <p className="text-start text-xs text-muted-foreground">
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
                     <KeyIcon />
                  </InputGroupAddon>
               </InputGroup>

               <div className="text-right">
                  <Button
                     variant="link"
                     className="h-auto p-0 text-sm font-semibold text-foreground"
                     render={<Link href="/forgot-password" />}
                     nativeButton={false}
                  >
                     Forgot password?
                  </Button>
               </div>

               <Button className="w-full" type="button">
                  sign in
               </Button>
            </form>

            <AuthDivider>OR</AuthDivider>

            <p className="text-center text-sm text-muted-foreground">
               Want to be a caterer?{" "}
               <Button
                  variant="link"
                  className="h-auto p-0 text-sm font-semibold text-foreground"
                  render={<Link href="/onboarding" />}
                  nativeButton={false}
               >
                  sign up
               </Button>
            </p>
         </div>
      </AuthShell>
   )
}
