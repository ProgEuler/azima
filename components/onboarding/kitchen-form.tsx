"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	CakeIcon,
	CityIcon,
	CoffeeIcon,
	ForkKnifeIcon,
	MapPinIcon,
	StarIcon,
	UsersThreeIcon,
	WineIcon,
} from "@phosphor-icons/react"

import { OnboardingShell } from "@/components/onboarding-shell"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const serviceOptions = [
	{ value: "catering", label: "Catering", Icon: ForkKnifeIcon },
	{ value: "sweets", label: "Sweets", Icon: CakeIcon },
	{ value: "drinks", label: "Drinks", Icon: CoffeeIcon },
	{ value: "beverages", label: "Beverages", Icon: WineIcon },
] as const

type ServiceValue = (typeof serviceOptions)[number]["value"]

const schema = z
	.object({
		whatYouCook: z.string().min(2, "Tell us what you cook"),
		capacity: z
			.coerce
			.number({ message: "Capacity is required" })
			.int("Whole numbers only")
			.positive("Must be greater than zero"),
		services: z
			.array(z.enum(["catering", "sweets", "drinks", "beverages"]))
			.min(1, "Select at least one service"),
		city: z.string().min(2, "City is required"),
		knownFor: z.string().min(2, "Tell hosts what you're known for"),
		smallestOrder: z.coerce
			.number({ message: "Required" })
			.int("Whole numbers only")
			.positive("Must be greater than zero"),
		largestOrder: z.coerce
			.number({ message: "Required" })
			.int("Whole numbers only")
			.positive("Must be greater than zero"),
		notice: z.enum(["any", "48h"], {
			message: "Choose how much notice you need",
		}),
	})
	.refine((d) => d.largestOrder >= d.smallestOrder, {
		message: "Largest order must be \u2265 smallest order",
		path: ["largestOrder"],
	})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

export function KitchenForm() {
	const router = useRouter()

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(schema),
		defaultValues: {
			whatYouCook: "",
			capacity: "" as unknown as number,
			services: [],
			city: "",
			knownFor: "",
			smallestOrder: "" as unknown as number,
			largestOrder: "" as unknown as number,
			notice: undefined as unknown as FormOutput["notice"],
		},
	})

	const onSubmit = handleSubmit(() => {
		router.push("/onboarding/submitted")
	})

	return (
		<OnboardingShell backHref="/onboarding" backLabel="Back">
			<form className="space-y-8" onSubmit={onSubmit} noValidate>
				<div className="flex flex-col items-start gap-3">
					<OnboardingStepper current={2} />
					<div className="space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">Your Kitchen</h1>
						<p className="text-muted-foreground">
							Share the details that help hosts decide if you&apos;re the
							right fit for their event.
						</p>
					</div>
				</div>

				{/* SECTION 1 — What You Cook & Capacity */}
				<Section
					title="What you cook & capacity"
					description="A short summary of your menu and how many guests you can serve."
				>
					<div className="grid gap-3 sm:grid-cols-2">
						<Field label="What you cook" error={errors.whatYouCook?.message}>
							<Textarea
								placeholder="e.g. North African tagines, mezze platters…"
								rows={2}
								aria-invalid={!!errors.whatYouCook}
								{...register("whatYouCook")}
							/>
						</Field>
						<Field
							label="For how many (guests)"
							error={errors.capacity?.message}
						>
							<InputGroup>
								<InputGroupInput
									type="number"
									inputMode="numeric"
									min={1}
									placeholder="e.g. 80"
									aria-invalid={!!errors.capacity}
									{...register("capacity")}
								/>
								<InputGroupAddon align="inline-start">
									<UsersThreeIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>
					</div>
				</Section>

				{/* SECTION 2 — Services */}
				<Section
					title="Services offered"
					description="Pick the categories that match what you provide."
					error={errors.services?.message}
				>
					<Controller
						control={control}
						name="services"
						render={({ field }) => (
							<div className="grid grid-cols-2 gap-3">
								{serviceOptions.map(({ value, label, Icon }) => {
									const checked = field.value.includes(value as ServiceValue)
									return (
										<label
											key={value}
											className="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-input/20 px-3 py-3 transition-colors hover:bg-input/30 has-[[data-slot=checkbox]:checked]:border-primary has-[[data-slot=checkbox]:checked]:bg-primary/5 dark:bg-input/30"
										>
											<Checkbox
												checked={checked}
												onCheckedChange={(next) => {
													const nextChecked = next === true
													const current = field.value as ServiceValue[]
													field.onChange(
														nextChecked
															? [...current, value as ServiceValue]
															: current.filter((v) => v !== value),
													)
												}}
											/>
											<Icon className="size-4 text-muted-foreground" />
											<span className="font-medium text-sm">{label}</span>
										</label>
									)
								})}
							</div>
						)}
					/>
				</Section>

				{/* SECTION 3 — Location & Reputation */}
				<Section
					title="Location & reputation"
					description="Where you operate and the kind of orders you accept."
				>
					<div className="grid gap-3 sm:grid-cols-2">
						<Field label="City" error={errors.city?.message}>
							<InputGroup>
								<InputGroupInput
									placeholder="e.g. Casablanca"
									autoComplete="address-level2"
									aria-invalid={!!errors.city}
									{...register("city")}
								/>
								<InputGroupAddon align="inline-start">
									<MapPinIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field
							label="What you are known for"
							error={errors.knownFor?.message}
						>
							<InputGroup>
								<InputGroupInput
									placeholder="e.g. family-style feasts"
									aria-invalid={!!errors.knownFor}
									{...register("knownFor")}
								/>
								<InputGroupAddon align="inline-start">
									<StarIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						<Field
							label="Smallest order (guests)"
							error={errors.smallestOrder?.message}
						>
							<InputGroup>
								<InputGroupInput
									type="number"
									inputMode="numeric"
									min={1}
									placeholder="e.g. 10"
									aria-invalid={!!errors.smallestOrder}
									{...register("smallestOrder")}
								/>
								<InputGroupAddon align="inline-start">
									<CityIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field
							label="Largest order (guests)"
							error={errors.largestOrder?.message}
						>
							<InputGroup>
								<InputGroupInput
									type="number"
									inputMode="numeric"
									min={1}
									placeholder="e.g. 200"
									aria-invalid={!!errors.largestOrder}
									{...register("largestOrder")}
								/>
								<InputGroupAddon align="inline-start">
									<CityIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>
					</div>
				</Section>

				{/* SECTION 4 — Availability */}
				<Section
					title="Availability & notice"
					description="Set the lead time you need to accept a booking."
					error={errors.notice?.message}
				>
					<Controller
						control={control}
						name="notice"
						render={({ field }) => (
							<RadioGroup
								value={field.value}
								onValueChange={(v) =>
									field.onChange(v as FormInput["notice"])
								}
								className="gap-2"
							>
								<RadioOption
									value="any"
									title="Any date, including today"
									description="I'm flexible and can handle last-minute orders."
									checked={field.value === "any"}
								/>
								<RadioOption
									value="48h"
									title="At least 48 hours"
									description="I need two days to prep ingredients and plating."
									checked={field.value === "48h"}
								/>
							</RadioGroup>
						)}
					/>
				</Section>

				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button
						variant="outline"
						render={<Link href="/onboarding" />}
						nativeButton={false}
					>
						Back
					</Button>
					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="sm:min-w-48"
					>
						Submit Application
					</Button>
				</div>
			</form>
		</OnboardingShell>
	)
}

function Section({
	title,
	description,
	error,
	children,
}: {
	title: string
	description?: string
	error?: string
	children: React.ReactNode
}) {
	return (
		<section className="space-y-3">
			<header className="space-y-0.5">
				<h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					{title}
				</h2>
				{description ? (
					<p className="text-muted-foreground text-xs">{description}</p>
				) : null}
			</header>
			{children}
			{error ? (
				<p role="alert" className="text-destructive text-xs">
					{error}
				</p>
			) : null}
		</section>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: React.ReactNode
}) {
	return (
		<div className="space-y-1.5">
			<label className="font-medium text-foreground text-xs leading-none">
				{label}
			</label>
			{children}
			{error ? (
				<p role="alert" className="text-destructive text-xs">
					{error}
				</p>
			) : null}
		</div>
	)
}

function RadioOption({
	value,
	title,
	description,
	checked,
}: {
	value: string
	title: string
	description: string
	checked: boolean
}) {
	return (
		<label
			className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-input/30 has-[[data-slot=radio-group-item]:checked]:border-primary has-[[data-slot=radio-group-item]:checked]:bg-primary/5 ${
				checked ? "border-primary bg-primary/5" : "border-input bg-input/20 dark:bg-input/30"
			}`}
		>
			<RadioGroupItem value={value} />
			<div className="space-y-0.5">
				<p className="font-medium text-sm">{title}</p>
				<p className="text-muted-foreground text-xs">{description}</p>
			</div>
		</label>
	)
}
