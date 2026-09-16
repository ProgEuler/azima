"use client"

import { useEffect, useState } from "react"
import {
   Briefcase,
   Calendar,
   Clock,
   DollarSign,
   Lock,
   Unlock,
   Users,
} from "lucide-react"
import {
   Card,
   CardContent,
   CardHeader,
} from "@/components/event-manager/ui/card"
import { Button } from "@/components/event-manager/ui/button"
import { Badge } from "@/components/event-manager/ui/badge"
import { cn } from "@/lib/utils"
import type { Event } from "@/components/event-manager"

const STORAGE_KEY = "today-card-status"

const isSameDay = (a: Date, b: Date) =>
   a.getFullYear() === b.getFullYear() &&
   a.getMonth() === b.getMonth() &&
   a.getDate() === b.getDate()

const formatTime = (date: Date) =>
   date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
   })

const formatCash = (n: number) =>
   n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
   })

export interface TodayCardProps {
   events: Event[]
   date?: Date
   className?: string
}

export function TodayCard({
   events,
   date = new Date(),
   className,
}: TodayCardProps) {
   const [isOpen, setIsOpen] = useState(true)
   const [hydrated, setHydrated] = useState(false)

   // Hydrate from localStorage on mount
   useEffect(() => {
      const stored =
         typeof window !== "undefined"
            ? window.localStorage.getItem(STORAGE_KEY)
            : null
      if (stored === "open" || stored === "closed") {
         setIsOpen(stored === "open")
      }
      setHydrated(true)
   }, [])

   const toggle = () => {
      setIsOpen((prev) => {
         const next = !prev
         if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, next ? "open" : "closed")
         }
         return next
      })
   }

   const todayEvents = events
      .filter((e) => isSameDay(new Date(e.startTime), date))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

   const bookedJobs = todayEvents.length
   const guests = todayEvents.reduce(
      (sum, e) => sum + (e.guestCount ?? e.attendees?.length ?? 0),
      0
   )
   const cash = todayEvents.reduce((sum, e) => sum + (e.cashAmount ?? 0), 0)

   const dateLabel = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
   })
   const dateShort = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
   })

   // Avoid hydration mismatch on the toggle label/badge — render a stable placeholder
   // until we've read localStorage.
   const showOpen = hydrated ? isOpen : true

   return (
      <Card className={cn("flex flex-col", className)}>
         <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4">
            <Badge
               variant={showOpen ? "default" : "secondary"}
               className={cn(
                  "shrink-0 text-[10px] whitespace-nowrap sm:text-xs",
                  showOpen
                     ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20"
                     : "bg-muted text-muted-foreground"
               )}
            >
               {showOpen ? "Open to new requests" : "Closed to new requests"}
            </Badge>
         </div>
         <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
            <div className="min-w-0">
               <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <Calendar className="h-3.5 w-3.5" />
                  Today
               </div>
               <h3 className="mt-1 truncate text-lg font-semibold sm:text-xl">
                  {dateLabel}
               </h3>
               <p className="text-xs text-muted-foreground">{dateShort}</p>
            </div>
         </CardHeader>

         <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
               <StatBlock
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Booked jobs"
                  value={bookedJobs.toString()}
               />
               <StatBlock
                  icon={<Users className="h-4 w-4" />}
                  label="Guests to cook for"
                  value={guests.toString()}
               />
               <StatBlock
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Cash to collect"
                  value={formatCash(cash)}
               />
            </div>

            <Button
               type="button"
               onClick={toggle}
               variant={showOpen ? "outline" : "default"}
               className="w-full"
            >
               {showOpen ? (
                  <>
                     <Lock className="mr-2 h-4 w-4" />
                     Close this date
                  </>
               ) : (
                  <>
                     <Unlock className="mr-2 h-4 w-4" />
                     Open this date
                  </>
               )}
            </Button>

            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Today's bookings</h4>
                  <span className="text-xs text-muted-foreground">
                     {bookedJobs}
                  </span>
               </div>

               <div className="max-h-64 overflow-y-auto rounded-md border bg-background/40">
                  {todayEvents.length === 0 ? (
                     <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No bookings today
                     </p>
                  ) : (
                     <ul className="divide-y">
                        {todayEvents.map((event) => (
                           <li
                              key={event.id}
                              className="flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-accent/40"
                           >
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                 <Clock className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <p className="truncate text-sm font-medium">
                                    {event.title}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {formatTime(event.startTime)} –{" "}
                                    {formatTime(event.endTime)}
                                    {event.guestCount !== undefined && (
                                       <> · {event.guestCount} guests</>
                                    )}
                                 </p>
                              </div>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

function StatBlock({
   icon,
   label,
   value,
}: {
   icon: React.ReactNode
   label: string
   value: string
}) {
   return (
      <div className="flex flex-col gap-1 rounded-md border bg-background/60 p-2.5">
         <div className="flex items-center gap-1.5 text-muted-foreground">
            {icon}
         </div>
         <div className="text-lg leading-none font-semibold sm:text-xl">
            {value}
         </div>
         <div className="text-[10px] leading-tight text-muted-foreground sm:text-xs">
            {label}
         </div>
      </div>
   )
}
