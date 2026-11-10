/**
 * Browser-side token storage for the portal session.
 * Tokens live in localStorage so a refresh keeps the user signed in.
 */

const ACCESS_KEY = "azima.access"
const REFRESH_KEY = "azima.refresh"

type Listener = () => void
const listeners = new Set<Listener>()

function read(key: string): string | null {
	if (typeof window === "undefined") return null
	try {
		return window.localStorage.getItem(key)
	} catch {
		return null
	}
}

function write(key: string, value: string | null) {
	if (typeof window === "undefined") return
	try {
		if (value === null) window.localStorage.removeItem(key)
		else window.localStorage.setItem(key, value)
	} catch {
		// Storage can be unavailable (private mode); the session is then in-memory only.
	}
}

export const session = {
	getAccess: () => read(ACCESS_KEY),
	getRefresh: () => read(REFRESH_KEY),
	setTokens(tokens: { access: string; refresh?: string }) {
		write(ACCESS_KEY, tokens.access)
		if (tokens.refresh) write(REFRESH_KEY, tokens.refresh)
	},
	clear() {
		write(ACCESS_KEY, null)
		write(REFRESH_KEY, null)
		listeners.forEach((l) => l())
	},
	/** Called when the session is lost (refresh failed / signed out). */
	onCleared(listener: Listener) {
		listeners.add(listener)
		return () => {
			listeners.delete(listener)
		}
	},
}
