import { createReducer } from "@reduxjs/toolkit"
import type { History } from "history"

export interface HistoryStore {
	history: History
}

export function createHistoryReducer(history: History) {
	return createReducer({ history }, builder => builder)
}
