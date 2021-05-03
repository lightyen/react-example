import { createReducer } from "@reduxjs/toolkit"
import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/zh-tw"
import localizedFormat from "dayjs/plugin/localizedFormat"
import { setLocale } from "./action"
import type { Locale } from "./languages"
import { getLocale, storeLocale } from "./languages"

interface I18nStoreType {
	enable: boolean
	locale: Locale
}

export type I18nStore = Readonly<I18nStoreType>

const init: I18nStore = {
	enable: true,
	locale: getLocale(),
}

window.__locale__ = getLocale()

dayjs.extend(localizedFormat)
dayjs.locale(window.__locale__.toLocaleLowerCase())

export const i18n = createReducer(init, builder =>
	builder.addCase(setLocale, (state, { payload: { locale, cached = false } }) => {
		cached && storeLocale(locale)
		window.__locale__ = locale
		state.locale = locale
		dayjs.locale(locale.toLocaleLowerCase())
	}),
)
