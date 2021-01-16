import { useMemo } from "react"
import { bindActionCreators } from "@reduxjs/toolkit"
import { useSelector as useReduxSelector, useDispatch, TypedUseSelectorHook } from "react-redux"
import { RootStore } from "./reducer"

import app from "~/store/app/action"
import theme from "~/store/theme/action"
import i18n from "~/store/i18n/action"
import data from "~/store/data/action"

export const useSelector: TypedUseSelectorHook<RootStore> = useReduxSelector

export function useAction() {
	const dispatch = useDispatch()
	return useMemo(
		() => ({
			app: bindActionCreators(app, dispatch),
			theme: bindActionCreators(theme, dispatch),
			i18n: bindActionCreators(i18n, dispatch),
			data: bindActionCreators(data, dispatch),
		}),
		[dispatch],
	)
}

export function useI18n() {
	return useSelector(state => state.i18n)
}
