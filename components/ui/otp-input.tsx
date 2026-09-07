"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type OtpInputProps = {
	value: string
	onChange: (value: string) => void
	length?: number
	invalid?: boolean
	disabled?: boolean
	className?: string
	"aria-label"?: string
}

export function OtpInput({
	value,
	onChange,
	length = 6,
	invalid = false,
	disabled = false,
	className,
	"aria-label": ariaLabel = "Verification code",
}: OtpInputProps) {
	const refs = React.useRef<Array<HTMLInputElement | null>>([])
	const digits = React.useMemo(() => {
		const out = value.split("").slice(0, length)
		while (out.length < length) out.push("")
		return out
	}, [value, length])

	const setDigit = React.useCallback(
		(index: number, char: string) => {
			const next = [...digits]
			next[index] = char
			const joined = next.join("").slice(0, length)
			onChange(joined)
		},
		[digits, onChange, length],
	)

	const focusIndex = (index: number) => {
		const clamped = Math.max(0, Math.min(length - 1, index))
		refs.current[clamped]?.focus()
		refs.current[clamped]?.select()
	}

	const handleChange = (index: number, raw: string) => {
		const cleaned = raw.replace(/\D/g, "")
		if (cleaned.length === 0) {
			setDigit(index, "")
			return
		}
		// Take the first digit only; the rest are handled by paste or auto-advance.
		const char = cleaned.charAt(0)
		setDigit(index, char)
		if (index < length - 1) focusIndex(index + 1)
	}

	const handleKeyDown = (
		index: number,
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "ArrowLeft" && index > 0) {
			event.preventDefault()
			focusIndex(index - 1)
			return
		}
		if (event.key === "ArrowRight" && index < length - 1) {
			event.preventDefault()
			focusIndex(index + 1)
			return
		}
		if (event.key === "Backspace") {
			if (digits[index]) {
				// Cell has a value — clear it and stay.
				event.preventDefault()
				setDigit(index, "")
				return
			}
			if (index > 0) {
				event.preventDefault()
				setDigit(index - 1, "")
				focusIndex(index - 1)
			}
		}
	}

	const handlePaste = (
		index: number,
		event: React.ClipboardEvent<HTMLInputElement>,
	) => {
		const pasted = event.clipboardData.getData("text")
		const cleaned = pasted.replace(/\D/g, "").slice(0, length - index)
		if (cleaned.length === 0) return
		event.preventDefault()
		const next = [...digits]
		for (let i = 0; i < cleaned.length; i++) {
			next[index + i] = cleaned.charAt(i)
		}
		const joined = next.join("").slice(0, length)
		onChange(joined)
		const lastFilled = Math.min(index + cleaned.length, length - 1)
		focusIndex(lastFilled)
	}

	return (
		<div
			role="group"
			aria-label={ariaLabel}
			className={cn("flex w-full justify-center gap-2 sm:gap-3", className)}
		>
			<span className="sr-only">{ariaLabel}</span>
			{digits.map((digit, index) => (
				<input
					key={index}
					ref={(el) => {
						refs.current[index] = el
					}}
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					autoComplete="one-time-code"
					maxLength={1}
					value={digit}
					disabled={disabled}
					aria-label={`Digit ${index + 1} of ${length}`}
					aria-invalid={invalid || undefined}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={(e) => handlePaste(index, e)}
					onFocus={(e) => e.currentTarget.select()}
					className={cn(
						"h-12 w-10 text-center font-semibold text-lg rounded-md border bg-input/20",
						"border-input",
						"transition-colors outline-none",
						"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
						"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
						"dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"sm:w-12",
					)}
				/>
			))}
		</div>
	)
}
