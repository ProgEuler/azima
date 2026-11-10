"use client"

import { useCallback, useEffect, useState } from "react"
import { ApiError } from "@/lib/api/client"

type Settled<T> = {
	key: string
	data: T | null
	error: ApiError | null
}

/**
 * Minimal data-fetching hook: runs `fetcher` on mount and whenever `deps`
 * change, exposes loading/error state and a `reload` to refetch after mutations.
 * Previously loaded data stays available while a refetch is in flight.
 */
export function useApi<T>(
	fetcher: (signal: AbortSignal) => Promise<T>,
	deps: ReadonlyArray<unknown> = [],
) {
	const [nonce, setNonce] = useState(0)
	const [settled, setSettled] = useState<Settled<T>>({
		key: "",
		data: null,
		error: null,
	})
	const key = `${nonce}:${JSON.stringify(deps)}`

	useEffect(() => {
		const controller = new AbortController()
		fetcher(controller.signal)
			.then((data) => setSettled({ key, data, error: null }))
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") return
				setSettled((prev) => ({
					key,
					data: prev.data,
					error:
						error instanceof ApiError
							? error
							: new ApiError("Something went wrong. Please try again.", 0),
				}))
			})
		return () => controller.abort()
		// The fetcher is intentionally re-read only when `key` changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	const reload = useCallback(() => setNonce((n) => n + 1), [])
	const setData = useCallback(
		(data: T | null) => setSettled((prev) => ({ ...prev, data })),
		[],
	)

	return {
		data: settled.data,
		error: settled.error,
		loading: settled.key !== key,
		reload,
		setData,
	}
}

/** Debounce a rapidly changing value (search boxes). */
export function useDebounced<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value)
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay)
		return () => clearTimeout(t)
	}, [value, delay])
	return debounced
}
