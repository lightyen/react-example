import { createReducer } from "@reduxjs/toolkit"

import { fetchGithubIssuesSuccess } from "./action"

export interface DataStore {
	issues: unknown[]
}

const init: DataStore = {
	issues: [],
}

export const data = createReducer(init, builder =>
	builder.addCase(fetchGithubIssuesSuccess, (state, action) => {
		state.issues = action.payload.issues
	}),
)
