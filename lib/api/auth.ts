import { get, post } from "@/lib/api/client"

export type PortalRole = "admin" | "provider"

export type ApplicationStatus =
	| "pending"
	| "under_review"
	| "approved"
	| "rejected"

export type PortalUser = {
	id: string
	email: string | null
	phone: string | null
	full_name: string
	role: PortalRole
	is_approved: boolean
	application_status: ApplicationStatus | null
	rejection_reason: string
	business_name: string | null
	logo?: string | null
}

export type LoginResult = {
	tokens: { access: string; refresh: string }
	role: PortalRole
	is_approved: boolean
	application_status: ApplicationStatus | null
}

export const authApi = {
	login: (email: string, password: string) =>
		post<LoginResult>("/accounts/portal/login/", { email, password }, true),
	me: () => get<PortalUser>("/accounts/portal/me/"),
	logout: (refresh: string | null) =>
		post<null>("/accounts/user/logout/", { refresh: refresh ?? "" }),
	forgotPassword: (email: string) =>
		post<{ message: string }>("/accounts/portal/forgot-password/", { email }, true),
	checkOtp: (email: string, otp: string) =>
		post<{ valid: boolean }>("/accounts/portal/check-otp/", { email, otp }, true),
	resetPassword: (email: string, otp: string, newPassword: string) =>
		post<{ message: string }>(
			"/accounts/portal/reset-password/",
			{ email, otp, new_password: newPassword },
			true,
		),
	registerProvider: (payload: ProviderRegistration) =>
		post<{ application_id: string; message: string }>(
			"/accounts/provider/register/",
			payload,
			true,
		),
	applicationStatus: () =>
		get<{
			id: string
			business_name: string
			status: ApplicationStatus
			rejection_reason: string
			created_at: string
			reviewed_at: string | null
		}>("/accounts/provider/application-status/"),
}

export type ProviderRegistration = {
	business_name: string
	business_email: string
	phone: string
	password: string
	service_types: Array<"catering" | "sweets" | "drinks">
	city: string
	description: string
	smallest_order: number
	largest_order: number
	order_notice_period: "instant" | "at_least_48_hours"
}
