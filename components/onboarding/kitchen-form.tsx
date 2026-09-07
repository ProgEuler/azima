"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { OnboardingShell } from "@/components/onboarding-shell"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"

const serviceOptions = ["Catering", "Sweets", "Drinks"] as const
const noticeOptions = [
   { value: "any", label: "Any date, including today" },
   { value: "48h", label: "At least 48 hours" },
] as const

const schema = z.object({
   services: z
      .array(z.enum(serviceOptions))
      .min(1, "Select at least one service"),
   city: z.string().min(2, "City is required"),
   bio: z.string().min(10, "Tell hosts a bit about what you do"),
   // One field, two numbers — written by the dual-thumb slider.
   orderRange: z
      .tuple([
         z.number().int().nonnegative(),
         z.number().int().nonnegative(),
      ])
      .refine(([min, max]) => max >= min, {
         message: "Largest order must be \u2265 smallest",
         path: [1],
      }),
   notice: z.enum(["any", "48h"], {
      message: "Select one",
   }),
})

type FormValues = z.infer<typeof schema>

export function KitchenForm() {
   const router = useRouter()

   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
   } = useForm<FormValues>({
      resolver: zodResolver(schema),
      mode: "onSubmit",
      reValidateMode: "onChange",
      defaultValues: {
         services: [],
         city: "",
         bio: "",
         orderRange: [10, 80],
         notice: undefined,
      },
   })

   const onSubmit = handleSubmit(() => {
      router.push("/onboarding/submitted")
   })

   return (
      <OnboardingShell>
         <form className="space-y-8" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col items-start gap-4">
               <OnboardingStepper current={2} />
               <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                     What you cook, and for how many
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                     This is what hosts see and what we match their occasions
                     against, so keep it accurate.
                  </p>
               </div>
            </div>

            <div className="space-y-8">
               {/* City */}
               <Field label="City" error={errors.city?.message}>
                  <InputGroup>
                     <InputGroupInput
                        placeholder="Beirut"
                        autoComplete="address-level2"
                        aria-invalid={!!errors.city}
                        {...register("city")}
                     />
                  </InputGroup>
               </Field>

               {/* Bio */}
               <Field
                  label="What you are known for"
                  error={errors.bio?.message}
                  hint="One or two lines. A host who has never heard of you reads this first."
               >
                  <Textarea
                     placeholder="Home-style Lebanese cooking for family gatherings and iftars."
                     rows={3}
                     aria-invalid={!!errors.bio}
                     {...register("bio")}
                  />
               </Field>

               {/* Services toggle group */}
               <Controller
                  control={control}
                  name="services"
                  render={({ field }) => (
                     <Field
                        label="What you provide"
                        error={errors.services?.message}
                     >
                        <div className="grid grid-cols-3 gap-2">
                           {serviceOptions.map((service) => {
                              const isSelected = field.value.includes(service)
                              return (
                                 <Button
                                    key={service}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                       const next = isSelected
                                          ? field.value.filter(
                                               (s) => s !== service
                                            )
                                          : [...field.value, service]
                                       field.onChange(next)
                                    }}
                                 >
                                    {service}
                                 </Button>
                              )
                           })}
                        </div>
                     </Field>
                  )}
               />

               {/* Order range */}
               <Controller
                  control={control}
                  name="orderRange"
                  render={({ field }) => {
                     const [min, max] = field.value ?? [0, 0]
                     return (
                        <Field
                           label="Orders you can take"
                           error={errors.orderRange?.message}
                           hint="Occasions outside this range will not be offered to you."
                        >
                           <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-foreground">
                                 {min}{" "}
                                 <span className="text-muted-foreground">
                                    guests min
                                 </span>
                              </span>
                              <span className="font-medium text-foreground">
                                 {max}{" "}
                                 <span className="text-muted-foreground">
                                    guests max
                                 </span>
                              </span>
                           </div>
                           <Slider
                              min={0}
                              max={500}
                              step={5}
                              value={field.value}
                              onValueChange={(v) => field.onChange(v)}
                              aria-label="Order range"
                           />
                           <div className="flex justify-between text-[0.625rem] text-muted-foreground/70">
                              <span>0</span>
                              <span>500</span>
                           </div>
                        </Field>
                     )
                  }}
               />

               {/* Notice period */}
               <Controller
                  control={control}
                  name="notice"
                  render={({ field }) => (
                     <Field
                        label="How much notice you need"
                        error={errors.notice?.message}
                        hint="You can change this at any time from Availability."
                     >
                        <ToggleGroup
                           multiple={false}
                           value={field.value ? [field.value] : []}
                           onValueChange={(values) =>
                              field.onChange(values[0] ?? undefined)
                           }
                           spacing={0}
                           variant="outline"
                           className="w-full"
                        >
                           {noticeOptions.map((option) => (
                              <ToggleGroupItem
                                 key={option.value}
                                 value={option.value}
                                 className={cn(
                                    "h-10 flex-1 rounded-full border border-input text-sm font-medium",
                                    "data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
                                    "first:rounded-l-full last:rounded-r-full",
                                 )}
                              >
                                 {option.label}
                              </ToggleGroupItem>
                           ))}
                        </ToggleGroup>
                     </Field>
                  )}
               />
            </div>

            <Button
               className="w-full rounded-full"
               size="lg"
               type="submit"
               disabled={isSubmitting}
            >
               Submit application
            </Button>

            <p className="text-center text-sm">
               <Button
                  variant="link"
                  className="h-auto p-0 text-sm font-semibold text-foreground"
                  render={<Link href="/onboarding" />}
                  nativeButton={false}
               >
                  Back to your account details
               </Button>
            </p>
         </form>
      </OnboardingShell>
   )
}

function Field({
   label,
   error,
   hint,
   children,
}: {
   label: string
   error?: string
   hint?: string
   children: React.ReactNode
}) {
   return (
      <div className="space-y-3">
         <Label>{label}</Label>
         {children}
         {error ? (
            <p role="alert" className="text-xs text-destructive">
               {error}
            </p>
         ) : hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
         ) : null}
      </div>
   )
}
