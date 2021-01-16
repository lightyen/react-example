import { RootStore } from "~/store/reducer"
import tailwind from "~/tailwind.config"

import { Epic, combineEpics } from "redux-observable"
import { fromEvent } from "rxjs"
import { map } from "rxjs/operators"
import { setBreakingPoint } from "./action"

export type Action = ReturnType<typeof setBreakingPoint>

const epic: Epic<Action, Action, RootStore> = combineEpics(
	() =>
		fromEvent<MediaQueryListEvent>(window.matchMedia(`(min-width: ${tailwind.theme.screens.xl})`), "change").pipe(
			map(e => (e.matches ? "xl" : "lg")),
			map(breakpoint => setBreakingPoint({ breakpoint })),
		),
	() =>
		fromEvent<MediaQueryListEvent>(window.matchMedia(`(min-width: ${tailwind.theme.screens.lg})`), "change").pipe(
			map(e => (e.matches ? "lg" : "md")),
			map(breakpoint => setBreakingPoint({ breakpoint })),
		),
	() =>
		fromEvent<MediaQueryListEvent>(window.matchMedia(`(min-width: ${tailwind.theme.screens.md})`), "change").pipe(
			map(e => (e.matches ? "md" : "sm")),
			map(breakpoint => setBreakingPoint({ breakpoint })),
		),
	() =>
		fromEvent<MediaQueryListEvent>(window.matchMedia(`(min-width: ${tailwind.theme.screens.sm})`), "change").pipe(
			map(e => (e.matches ? "sm" : "xs")),
			map(breakpoint => setBreakingPoint({ breakpoint })),
		),
)

export default epic
