import { createAction } from "@reduxjs/toolkit"
import { FilterType } from "./model"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setFilters = createAction("SET_FILTERS", (payload: { id: string; filters: Array<FilterType<any>> }) => ({
	payload,
}))
export const setInput = createAction("SET_INPUT_VALUE", (payload: { id: string; fid: string; value: unknown }) => ({
	payload,
}))
export const setFocus = createAction("SET_FILTER_FOCUS", (payload: { id: string; fid: string; focus: boolean }) => ({
	payload,
}))

export default {
	setFilters,
	setInput,
	setFocus,
}
