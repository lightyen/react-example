import { Locale } from "~/store/i18n/languages"

export declare global {
	interface Window {
		__locale__: Locale
	}
}
