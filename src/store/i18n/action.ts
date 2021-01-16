import { createAction } from "@reduxjs/toolkit"
import { supports } from "./languages"

export const setLocale = createAction("SET_LOCALE", (payload: { locale: keyof typeof supports; cached?: boolean }) => {
	return { payload }
})

export default { setLocale }
