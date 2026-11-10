"use client"

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { authApi, type PortalUser } from "@/lib/api/auth"
import { session } from "@/lib/api/session"

type AuthStatus = "loading" | "authenticated" | "anonymous"

type AuthContextValue = {
	user: PortalUser | null
	status: AuthStatus
	/** Sign in and return where the user should land next. */
	signIn: (email: string, password: string) => Promise<string>
	signOut: () => Promise<void>
	refreshUser: () => Promise<PortalUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Landing route for a signed-in portal user. */
export function homeFor(user: Pick<PortalUser, "role" | "is_approved">) {
	if (user.role === "admin") return "/admin"
	return user.is_approved ? "/provider" : "/onboarding/submitted"
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter()
	const [user, setUser] = useState<PortalUser | null>(null)
	const [status, setStatus] = useState<AuthStatus>("loading")

	const refreshUser = useCallback(async () => {
		if (!session.getAccess()) {
			setUser(null)
			setStatus("anonymous")
			return null
		}
		try {
			const me = await authApi.me()
			setUser(me)
			setStatus("authenticated")
			return me
		} catch {
			session.clear()
			setUser(null)
			setStatus("anonymous")
			return null
		}
	}, [])

	useEffect(() => {
		void Promise.resolve().then(refreshUser)
		// A failed token refresh anywhere in the app drops the session.
		return session.onCleared(() => {
			setUser(null)
			setStatus("anonymous")
		})
	}, [refreshUser])

	const signIn = useCallback(
		async (email: string, password: string) => {
			const result = await authApi.login(email, password)
			session.setTokens(result.tokens)
			const me = await authApi.me()
			setUser(me)
			setStatus("authenticated")
			return homeFor(me)
		},
		[],
	)

	const signOut = useCallback(async () => {
		const refresh = session.getRefresh()
		try {
			await authApi.logout(refresh)
		} catch {
			// Token may already be invalid; clearing locally is what matters.
		}
		session.clear()
		setUser(null)
		setStatus("anonymous")
		router.replace("/signin")
	}, [router])

	const value = useMemo(
		() => ({ user, status, signIn, signOut, refreshUser }),
		[user, status, signIn, signOut, refreshUser],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
	return ctx
}
