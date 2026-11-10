"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from "@/components/ui/input-group"
import { AuthDivider } from "@/components/auth-divider"
import { FormError } from "@/components/form-error"
import { useAuth } from "@/components/auth-provider"
import { AtIcon, KeyIcon } from "@phosphor-icons/react"

const schema = z.object({
   email: z.string().email("Email must be valid"),
   password: z.string().min(1, "Enter your password"),
})

type FormValues = z.infer<typeof schema>

export function AuthPage() {
   const router = useRouter()
   const { signIn } = useAuth()
   const [submitError, setSubmitError] = useState<unknown>(null)
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<FormValues>({
      resolver: zodResolver(schema),
      mode: "onSubmit",
      reValidateMode: "onChange",
      defaultValues: { email: "", password: "" },
   })

   const onSubmit = handleSubmit(async (values) => {
      setSubmitError(null)
      try {
         router.replace(await signIn(values.email, values.password))
      } catch (error) {
         setSubmitError(error)
      }
   })

   return (
      <AuthShell>
         <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-wide">Welcome back!</h1>
            <p className="text-base text-muted-foreground">
               Sign in with the email your account was opened with.
            </p>

            <form onSubmit={onSubmit} noValidate className="space-y-2">
               <p className="text-start text-xs text-muted-foreground">
                  Enter your email address and password to sign in
               </p>
               <FormError error={submitError} />
               <Field label="Email" error={errors.email?.message}>
                  <InputGroup>
                     <InputGroupInput
                        placeholder="your.email@example.com"
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                     />
                     <InputGroupAddon align="inline-start">
                        <AtIcon />
                     </InputGroupAddon>
                  </InputGroup>
               </Field>
               <Field label="Password" error={errors.password?.message}>
                  <InputGroup>
                     <InputGroupInput
                        placeholder="Enter your password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                        {...register("password")}
                     />
                     <InputGroupAddon align="inline-start">
                        <KeyIcon />
                     </InputGroupAddon>
                  </InputGroup>
               </Field>

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

               <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in…" : "sign in"}
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
