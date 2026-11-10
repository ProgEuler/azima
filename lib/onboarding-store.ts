/**
 * Holds the first onboarding step (account details) in memory until the
 * kitchen step is submitted. Kept out of web storage on purpose: it contains
 * the new password.
 */
export type AccountStep = {
	businessName: string
	businessEmail: string
	phone: string
	password: string
}

let account: AccountStep | null = null

export const onboardingStore = {
	get: () => account,
	set: (value: AccountStep) => {
		account = value
	},
	clear: () => {
		account = null
	},
}
