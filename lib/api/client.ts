import { session } from "@/lib/api/session"

export const API_URL = (
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/$/, "")

/** Error thrown for any non-2xx response, carrying the API's message and field errors. */
export class ApiError extends Error {
	status: number
	errors: Record<string, string[] | string> | null

	constructor(
		message: string,
		status: number,
		errors: Record<string, string[] | string> | null = null,
	) {
		super(message)
		this.name = "ApiError"
		this.status = status
		this.errors = errors
	}

	/** First validation message for a field, if the API returned one. */
	fieldError(field: string): string | undefined {
		const value = this.errors?.[field]
		return Array.isArray(value) ? value[0] : value
	}
}

type Query = Record<string, string | number | boolean | null | undefined>

export type RequestOptions = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
	body?: unknown
	query?: Query
	/** Skip the Authorization header (public endpoints). */
	anonymous?: boolean
	signal?: AbortSignal
}

function buildUrl(path: string, query?: Query) {
	const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`)
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined || value === null || value === "") continue
			url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

let refreshing: Promise<boolean> | null = null

/** Exchange the refresh token for a new access token (single-flight). */
async function refreshAccessToken(): Promise<boolean> {
	if (refreshing) return refreshing
	const refresh = session.getRefresh()
	if (!refresh) return false
	refreshing = (async () => {
		try {
			const res = await fetch(buildUrl("/accounts/token/refresh/"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refresh }),
			})
			if (!res.ok) return false
			const data = (await res.json()) as { access: string; refresh?: string }
			session.setTokens({ access: data.access, refresh: data.refresh })
			return true
		} catch {
			return false
		} finally {
			refreshing = null
		}
	})()
	return refreshing
}

async function send(path: string, options: RequestOptions): Promise<Response> {
	const headers: Record<string, string> = { Accept: "application/json" }
	let body: BodyInit | undefined
	if (options.body instanceof FormData) {
		body = options.body
	} else if (options.body !== undefined) {
		headers["Content-Type"] = "application/json"
		body = JSON.stringify(options.body)
	}
	const access = options.anonymous ? null : session.getAccess()
	if (access) headers.Authorization = `Bearer ${access}`
	return fetch(buildUrl(path, options.query), {
		method: options.method ?? "GET",
		headers,
		body,
		signal: options.signal,
	})
}

/**
 * Typed JSON request helper. Unwraps the `{ success, data }` envelope and
 * transparently refreshes an expired access token once.
 */
export async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	let res: Response
	try {
		res = await send(path, options)
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw error
		throw new ApiError(
			"Could not reach the server. Check your connection and try again.",
			0,
		)
	}

	if (res.status === 401 && !options.anonymous && session.getRefresh()) {
		if (await refreshAccessToken()) {
			res = await send(path, options)
		} else {
			session.clear()
		}
	}

	if (res.status === 204) return undefined as T

	let payload: unknown = null
	try {
		payload = await res.json()
	} catch {
		payload = null
	}

	if (!res.ok) {
		const body = (payload ?? {}) as {
			message?: string
			detail?: string
			errors?: Record<string, string[] | string> | null
		}
		if (res.status === 401 && !options.anonymous) session.clear()
		throw new ApiError(
			body.message ?? body.detail ?? "Something went wrong. Please try again.",
			res.status,
			body.errors ?? null,
		)
	}

	return payload as T
}

/** Envelope for single-object responses. */
export type Envelope<T> = { success: boolean; message?: string; data: T }

/** Envelope for paginated list responses. */
export type Paginated<T> = {
	success: boolean
	count: number
	total_pages: number
	current_page: number
	next: string | null
	previous: string | null
	results: T[]
}

export async function get<T>(path: string, query?: Query, signal?: AbortSignal) {
	return (await request<Envelope<T>>(path, { query, signal })).data
}

export async function getPage<T>(path: string, query?: Query, signal?: AbortSignal) {
	return request<Paginated<T>>(path, { query, signal })
}

export async function post<T>(path: string, body?: unknown, anonymous = false) {
	return (await request<Envelope<T>>(path, { method: "POST", body, anonymous })).data
}

export async function patch<T>(path: string, body?: unknown) {
	return (await request<Envelope<T>>(path, { method: "PATCH", body })).data
}

export async function put<T>(path: string, body?: unknown) {
	return (await request<Envelope<T>>(path, { method: "PUT", body })).data
}

export async function del<T = null>(path: string) {
	return (await request<Envelope<T>>(path, { method: "DELETE" })).data
}

/** Resolve a media path returned by the API into an absolute URL. */
export function mediaUrl(path: string | null | undefined): string | null {
	if (!path) return null
	if (/^https?:\/\//.test(path)) return path
	const origin = API_URL.replace(/\/api\/v\d+$/, "")
	return `${origin}${path.startsWith("/") ? path : `/${path}`}`
}
