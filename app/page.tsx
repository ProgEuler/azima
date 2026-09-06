import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
   return (
      <div className="flex min-h-svh p-6">
         <div className="m-auto flex max-w-md min-w-0 flex-col items-center justify-center gap-4 text-sm leading-loose">
            <Link href="/provider">
               <Button>Provider</Button>
            </Link>
            <Link href="/admin">
               <Button>Admin</Button>
            </Link>
         </div>
      </div>
   )
}
