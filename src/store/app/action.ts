import { createAction } from "@reduxjs/toolkit"
import type { BreakingPoint } from "./types"

export const setSidebarVisible = createAction("SET_SIDEBAR_VISIBLE", (payload: { visible: boolean }) => ({ payload }))
export const setBreakingPoint = createAction<BreakingPoint>("SET_BREAKINGPOINT")
export default { setSidebarVisible }
