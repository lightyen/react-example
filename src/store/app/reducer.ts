import { createReducer } from "@reduxjs/toolkit"
import { theme } from "twin.macro"
import { setBreakingPoint, setSidebarVisible } from "./action"
import { BreakingPoint } from "./model"

export interface AppStore {
	breakpoint: BreakingPoint
	collapsed: boolean
	sidebarVisible: boolean
}

function getBreakPoint(): BreakingPoint {
	if (window.matchMedia(`(min-width: ${theme`screens.xl`})`).matches) {
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
	breakpoint: getBreakPoint(),
	collapsed: window.matchMedia(`(max-width: ${theme`screens.lg`})`).matches,
	sidebarVisible: false,
}

export const app = createReducer(init, builder =>
	builder
		.addCase(setBreakingPoint, (state, { payload: { breakpoint } }) => {
			// auto immutable when mutate
			state.breakpoint = breakpoint
			state.collapsed = state.sidebarVisible
				? false
				: breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md"
		})
		.addCase(setSidebarVisible, (state, { payload: { visible } }) => {
			state.sidebarVisible = visible
			state.collapsed = visible
				? false
				: state.breakpoint === "xs" || state.breakpoint === "sm" || state.breakpoint === "md"
		}),
)
