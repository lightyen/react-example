import { configureStore, combineReducers } from "@reduxjs/toolkit"
import type { AnyAction } from "@reduxjs/toolkit"

import { reducer } from "./filter/reducer"

import type { Store } from "./filter/reducer"
import { setFilters, setInput, setFocus } from "./filter/action"

type Action = ReturnType<typeof setFilters> | ReturnType<typeof setInput> | ReturnType<typeof setFocus>

interface RootStoreType {
	[tid: string]: Store
}

export type RootStore = Readonly<RootStoreType>

export function createReducerManager() {
	const reducers = {}
	let rootReducer = (state: RootStore = undefined, action: AnyAction) => state
	let keysToRemove: string[] = []
	return {
		reducer: (state: RootStoreType, action: Action) => {
			if (keysToRemove.length > 0) {
				state = { ...state }
				for (const key of keysToRemove) {
					delete state[key]
				}
				keysToRemove = []
			}
			return rootReducer(state, action)
		},
		add: (tid: string) => {
			if (tid == undefined || reducers[tid]) {
				return
			}
			reducers[tid] = reducer(tid)
			rootReducer = combineReducers(reducers)
		},
		remove: (tid: string) => {
			if (tid == undefined || !reducers[tid]) {
				return
			}
			delete reducers[tid]
			keysToRemove.push(tid)
			rootReducer = combineReducers(reducers)
		},
	}
}

export function createFilterStore(...tids: string[]) {
	const manager = createReducerManager()
	for (const id of tids) {
		manager.add(id)
	}
	const store = configureStore({
		devTools: process.env.NODE_ENV === "development" ? { name: "Filter" } : false,
		reducer: manager.reducer,
		preloadedState: undefined,
		middleware: [],
	})
	return { store, manager }
}

const manager = createReducerManager()
const store = configureStore({
	devTools: process.env.NODE_ENV === "development" ? { name: "Filter" } : false,
	reducer: manager.reducer,
	preloadedState: undefined,
	middleware: [],
})

/** 過濾器: 註冊全域緩存資料 */
export function register(...ids: string[]) {
	for (const id of ids) {
		manager.add(id)
	}
	store.replaceReducer(manager.reducer)
}

export { store, manager }
