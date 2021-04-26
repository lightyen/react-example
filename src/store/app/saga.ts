import { eventChannel } from "redux-saga"
import { fork, put, take } from "redux-saga/effects"
import { theme } from "twin.macro"
import { setBreakingPoint } from "./action"
import { BreakingPoint } from "./model"

const breakingPointChannel = (query: string, match: BreakingPoint, noMatch: BreakingPoint) =>
	eventChannel<BreakingPoint>(emit => {
		const mql = window.matchMedia(query)
		const cb = (e: MediaQueryListEvent) => (e.matches ? emit(match) : emit(noMatch))
		mql.addEventListener("change", cb)
		return () => mql.removeEventListener("change", cb)
	})

function* responsive_sm() {
	const chan = breakingPointChannel(`(min-width: ${theme`screens.sm`})`, "sm", "xs")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_md() {
	const chan = breakingPointChannel(`(min-width: ${theme`screens.md`})`, "md", "sm")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_lg() {
	const chan = breakingPointChannel(`(min-width: ${theme`screens.lg`})`, "lg", "md")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_xl() {
	const chan = breakingPointChannel(`(min-width: ${theme`screens.xl`})`, "xl", "lg")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

export default function* saga() {
	yield fork(responsive_sm)
	yield fork(responsive_md)
	yield fork(responsive_lg)
	yield fork(responsive_xl)
}
