import { createReducer } from "@reduxjs/toolkit"
import { Action, History, Location, parsePath } from "history"
import { back, onListen, push, replace } from "./action"

export interface HistoryStore {
	location?: Location
	action: Action | undefined
}

export function createHistoryReducer(history: History) {
	const init: HistoryStore = { location: history.location, action: undefined }
	return createReducer(init, builder =>
		builder
			.addCase(onListen, (state, { payload }) => {
				state.location = payload
				state.action = undefined
			})
			.addCase(push, (state, { payload }) => {
				state.location = parsePath(payload)
				state.action = "PUSH"
			})
			.addCase(back, (state, { payload }) => {
				state.location = parsePath(payload)
				state.action = "POP"
			})
			.addCase(replace, (state, { payload }) => {
				state.location = parsePath(payload)
				state.action = "REPLACE"
			}),
	)
}
