import {
	getCountries,
	getCountryCallingCode,
	isValidPhoneNumber,
	parsePhoneNumberFromString,
	type CountryCode,
} from "libphonenumber-js/mobile"

export type { CountryCode }

export const DEFAULT_COUNTRY: CountryCode = "LB"

/** "LB" -> 🇱🇧 */
export function flagEmoji(country: string): string {
	return [...country.toUpperCase()]
		.map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
		.join("")
}

const regionNames =
	typeof Intl !== "undefined" && "DisplayNames" in Intl
		? new Intl.DisplayNames(["en"], { type: "region" })
		: null

export type CountryOption = {
	iso: CountryCode
	name: string
	dial: string
	flag: string
}

let cached: CountryOption[] | null = null

/** Every country, Lebanon first, then A to Z. */
export function countryOptions(): CountryOption[] {
	if (cached) return cached
	const all = getCountries().map((iso) => ({
		iso,
		name: regionNames?.of(iso) ?? iso,
		dial: `+${getCountryCallingCode(iso)}`,
		flag: flagEmoji(iso),
	}))
	all.sort((a, b) =>
		a.iso === DEFAULT_COUNTRY ? -1 : b.iso === DEFAULT_COUNTRY ? 1 : a.name.localeCompare(b.name),
	)
	cached = all
	return all
}

/** A usable mobile number in international form ("+96171234567"). */
export function isValidMobile(value: string): boolean {
	return isValidPhoneNumber(value)
}

/** Splits "+96171234567" into its country and national digits (best guess). */
export function splitNumber(value: string): { country: CountryCode; national: string } {
	const parsed = value ? parsePhoneNumberFromString(value) : undefined
	if (parsed?.country) return { country: parsed.country, national: parsed.formatNational() }
	return { country: DEFAULT_COUNTRY, national: value.startsWith("+") ? "" : value }
}

export const PHONE_ERROR = "Enter a valid mobile number for the selected country."
