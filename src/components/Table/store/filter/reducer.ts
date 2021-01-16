import { createReducer } from "@reduxjs/toolkit"
import { FilterType } from "./model"
import { setFilters, setFocus, setInput } from "./action"

interface StoreType {
	id: string
	filters: Array<FilterType<unknown>>
	inputs: {
		[fid: string]: unknown
	}
	focus: {
		[fid: string]: boolean
	}
}

export type Store = Readonly<StoreType>

export const reducer = (id: string) =>
	createReducer<Store>({ id, filters: [], inputs: {}, focus: {} }, builder =>
		builder
			.addCase(setFilters, (state, { payload: { filters } }) => {
				state.filters = filters
			})
			.addCase(setInput, (state, { payload: { fid, value } }) => {
				state.inputs[fid] = value
			})
			.addCase(setFocus, (state, { payload: { fid, focus } }) => {
				state.focus[fid] = focus
			}),
	)
