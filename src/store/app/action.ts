import { BreakingPoint } from "./model"
import { createAction } from "@reduxjs/toolkit"

export const setSidebarVisible = createAction("SET_SIDEBAR_VISIBLE", (payload: { visible: boolean }) => ({ payload }))
export const setBreakingPoint = createAction("SET_BREAKINGPOINT", (payload: { breakpoint: BreakingPoint }) => ({
	payload,
}))
export default { setSidebarVisible }
