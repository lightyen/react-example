import { createReducer } from "@reduxjs/toolkit"
import { theme } from "twin.macro"
import { setBreakingPoint, setSidebarVisible } from "./action"
import type { BreakingPoint } from "./types"

export interface AppStore {
	breakpoint: BreakingPoint
	collapsed: boolean
	sidebarVisible: boolean
}

function getBreakingPoint(): BreakingPoint {
	if (window.matchMedia(`(min-width: ${theme`screens.2xl`})`).matches) {
		return "2xl"
	} else if (window.matchMedia(`(min-width: ${theme`screens.xl`})`).matches) {
		return "xl"
	} else if (window.matchMedia(`(min-width: ${theme`screens.lg`})`).matches) {
		return "lg"
	} else if (window.matchMedia(`(min-width: ${theme`screens.md`})`).matches) {
		return "md"
	} else if (window.matchMedia(`(min-width: ${theme`screens.sm`})`).matches) {
		return "sm"
	}
	return "xs"
}

const init: AppStore = {
	breakpoint: getBreakingPoint(),
	collapsed: window.matchMedia(`(max-width: ${theme`screens.lg`})`).matches,
	sidebarVisible: false,
}

export const app = createReducer(init, builder =>
	builder
		.addCase(setBreakingPoint, (state, { payload }) => {
			// auto immutable when mutate
			state.breakpoint = payload
			state.collapsed = state.sidebarVisible ? false : payload === "xs" || payload === "sm" || payload === "md"
		})
		.addCase(setSidebarVisible, (state, { payload: { visible } }) => {
			state.sidebarVisible = visible
			state.collapsed = visible
				? false
				: state.breakpoint === "xs" || state.breakpoint === "sm" || state.breakpoint === "md"
		}),
)
