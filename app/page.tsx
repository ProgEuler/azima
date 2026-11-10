"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { homeFor, useAuth } from "@/components/auth-provider"

/** Entry point: send visitors to their portal, or to sign in. */
export default function Page() {
   const router = useRouter()
   const { user, status } = useAuth()

   useEffect(() => {
      if (status === "anonymous") router.replace("/signin")
      else if (status === "authenticated" && user) router.replace(homeFor(user))
   }, [status, user, router])

   return (
      <div
         role="status"
         className="flex min-h-svh items-center justify-center text-muted-foreground text-sm"
      >
         Loading…
      </div>
   )
}
