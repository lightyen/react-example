import { combineReducers } from "@reduxjs/toolkit"
import { History } from "history"
import { app, AppStore } from "./app/reducer"
import { data, DataStore } from "./data/reducer"
import { createHistoryReducer, HistoryStore } from "./history/reducer"
import { i18n, I18nStore } from "./i18n/reducer"
import { theme, ThemeStore } from "./theme/reducer"

interface RootStoreType {
	app: AppStore
	theme: ThemeStore
	i18n: I18nStore
	data: DataStore
	history: HistoryStore
}

type DeepReadonly<T> = {
	readonly [K in keyof T]: T[K] extends Record<string, unknown> ? DeepReadonly<T[K]> : T[K]
}

export type RootStore = DeepReadonly<RootStoreType>

export default function createReducer(history: History) {
	return combineReducers({
		app,
		theme,
		i18n,
		data,
		history: createHistoryReducer(history),
	})
}
