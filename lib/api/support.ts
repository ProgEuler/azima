import { get } from "@/lib/api/client"

export type SupportContact = { email: string; phone: string; whatsapp: string }

export const supportApi = {
	contacts: (signal?: AbortSignal) => get<SupportContact>("/support/", undefined, signal),
}
