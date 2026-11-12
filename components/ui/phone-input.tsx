"use client"

import * as React from "react"
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js/mobile"
import { CaretDownIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
	countryOptions,
	DEFAULT_COUNTRY,
	flagEmoji,
	isValidMobile,
	splitNumber,
	type CountryCode,
} from "@/lib/phone"

type PhoneInputProps = {
	/** International form ("+96171234567"), or "" when empty. */
	value: string
	/** Called with the international form, or "" when the number box is empty. */
	onChange: (value: string) => void
	onBlur?: () => void
	id?: string
	name?: string
	disabled?: boolean
	invalid?: boolean
	className?: string
}

/**
 * Phone entry with a country dropdown (flag, ISO initials, dial code). The value it reports always carries the
 * country code, so it can go straight to the API; use `isValidMobile` (lib/phone) to validate it.
 */
export function PhoneInput({ value, onChange, onBlur, id, name, disabled, invalid, className }: PhoneInputProps) {
	const initial = React.useMemo(() => splitNumber(value), []) // eslint-disable-line react-hooks/exhaustive-deps
	const [country, setCountry] = React.useState<CountryCode>(initial.country ?? DEFAULT_COUNTRY)
	const [national, setNational] = React.useState(initial.national)
	const options = countryOptions()
	const dial = options.find((o) => o.iso === country)?.dial ?? ""

	function emit(nextCountry: CountryCode, text: string) {
		const digits = text.replace(/\D/g, "")
		if (!digits) return onChange("")
		const parsed = parsePhoneNumberFromString(text, nextCountry)
		onChange(parsed ? parsed.number : `${options.find((o) => o.iso === nextCountry)?.dial}${digits}`)
	}

	function onType(raw: string) {
		// A pasted "+44 7912 345678" moves the country selector instead of filling the number box.
		if (raw.trim().startsWith("+") || raw.trim().startsWith("00")) {
			const parsed = parsePhoneNumberFromString(raw.trim().replace(/^00/, "+"))
			if (parsed?.country) {
				setCountry(parsed.country)
				setNational(parsed.formatNational())
				return onChange(parsed.number)
			}
		}
		const formatted = new AsYouType(country).input(raw)
		setNational(formatted)
		emit(country, formatted)
	}

	function onPickCountry(next: CountryCode) {
		setCountry(next)
		emit(next, national)
	}

	return (
		<div className={cn("flex items-stretch gap-2", className)}>
			<div
				className={cn(
					"relative flex h-9 shrink-0 items-center gap-1.5 rounded-4xl border border-input bg-input/30 pr-2 pl-3 text-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
					invalid && "border-destructive",
					disabled && "pointer-events-none opacity-50",
				)}
			>
				<span aria-hidden className="text-base leading-none">{flagEmoji(country)}</span>
				<span className="font-medium">{country}</span>
				<span className="text-muted-foreground">{dial}</span>
				<CaretDownIcon className="size-3.5 text-muted-foreground" aria-hidden />
				<select
					aria-label="Country code"
					value={country}
					disabled={disabled}
					onChange={(e) => onPickCountry(e.target.value as CountryCode)}
					className="absolute inset-0 size-full cursor-pointer opacity-0"
				>
					{options.map((o) => (
						<option key={o.iso} value={o.iso}>
							{o.name} ({o.iso}) {o.dial}
						</option>
					))}
				</select>
			</div>
			<input
				id={id}
				name={name}
				type="tel"
				inputMode="tel"
				autoComplete="tel-national"
				disabled={disabled}
				aria-invalid={invalid || undefined}
				value={national}
				onChange={(e) => onType(e.target.value)}
				onBlur={onBlur}
				placeholder="Phone number"
				className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm"
			/>
		</div>
	)
}

export { isValidMobile }
