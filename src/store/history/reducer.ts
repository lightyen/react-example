import { createReducer } from "@reduxjs/toolkit"
import { Action, History, Location, parsePath } from "history"
import { onListen, push } from "./action"

export interface HistoryStore {
	location?: Location
	action?: Action
}

export function createHistoryReducer(history: History) {
	const init: HistoryStore = { location: history.location }
	return createReducer(init, builder =>
		builder
			.addCase(onListen, (state, { payload }) => {
				state.location = payload
				state.action = null
			})
			.addCase(push, (state, { payload }) => {
				state.location = parsePath(payload)
				state.action = "PUSH"
			}),
	)
}
