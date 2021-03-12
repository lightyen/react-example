import { bindActionCreators } from "@reduxjs/toolkit"
import { createContext, useMemo } from "react"
import { createDispatchHook, createSelectorHook, createStoreHook, ReactReduxContextValue } from "react-redux"
import app from "~/store/app/action"
import data from "~/store/data/action"
import i18n from "~/store/i18n/action"
import theme from "~/store/theme/action"
import { RootStore } from "./reducer"

export const AppStoreContext = createContext<ReactReduxContextValue<RootStore>>(null)
export const useStore = createStoreHook(AppStoreContext)
export const useDispatch = createDispatchHook(AppStoreContext)
export const useSelector = createSelectorHook(AppStoreContext)

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
