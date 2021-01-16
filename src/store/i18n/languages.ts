// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const supports = {
	"en-US": "English",
	"zh-TW": "正體中文",
}

export type Locale = keyof typeof supports

export const defaultLocale: keyof typeof supports = "en-US"

export function storeLocale(locale: string) {
	if (Object.keys(supports).some(loc => loc === locale)) {
		localStorage.setItem("locale", locale)
	} else {
		throw new Error(`"${locale}" resource is not found.`)
	}
}

export function getLocale(): keyof typeof supports {
	const locale = localStorage.getItem("locale") || window.navigator.language || defaultLocale
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			return "en-US"
		case "zh":
			return "zh-TW"
		default:
			return "en-US"
	}
}

import $enUS from "./locales/en-US.yml"
import $zhTW from "./locales/zh-TW.yml"

export function getLocaleMessages(locale: Locale) {
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			return $enUS
		case "zh":
			return $zhTW
		default:
			return $enUS
	}
}
