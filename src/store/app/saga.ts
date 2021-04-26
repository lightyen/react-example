import { eventChannel } from "redux-saga"
import { fork, put, take } from "redux-saga/effects"
import { theme } from "twin.macro"
import * as ac from "./action"
import type { BreakingPoint } from "./types"

const bpChan = (query: string, noMatch: BreakingPoint, match: BreakingPoint) =>
	eventChannel<BreakingPoint>(emit => {
		const mql = window.matchMedia(query)
		const cb = (e: MediaQueryListEvent) => (e.matches ? emit(match) : emit(noMatch))
		mql.addEventListener("change", cb)
		return () => mql.removeEventListener("change", cb)
	})

function responsive(query: string, noMatch: BreakingPoint, match: BreakingPoint) {
	return function* () {
		const chan = bpChan(query, noMatch, match)
		while (true) {
			yield put(ac.setBreakingPoint(yield take(chan)))
		}
	}
}

function* log() {
	while (true) {
		const action = yield take(ac.setBreakingPoint)
		console.log(action.payload)
	}
}

export default function* saga() {
	yield fork(responsive(`(min-width: ${theme`screens.sm`})`, "xs", "sm"))
	yield fork(responsive(`(min-width: ${theme`screens.md`})`, "sm", "md"))
	yield fork(responsive(`(min-width: ${theme`screens.lg`})`, "md", "lg"))
	yield fork(responsive(`(min-width: ${theme`screens.xl`})`, "lg", "xl"))
	yield fork(responsive(`(min-width: ${theme`screens.2xl`})`, "xl", "2xl"))
	yield fork(log)
}
