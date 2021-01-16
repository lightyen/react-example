import { eventChannel } from "redux-saga"
import { take, fork, put } from "redux-saga/effects"
import { BreakingPoint } from "./model"
import { setBreakingPoint } from "./action"
import tailwind from "~/tailwind.config"

const breakingPointChannel = (query: string, match: BreakingPoint, noMatch: BreakingPoint) =>
	eventChannel<BreakingPoint>(emit => {
		const mql = window.matchMedia(query)
		const cb = (e: MediaQueryListEvent) => (e.matches ? emit(match) : emit(noMatch))
		mql.addEventListener("change", cb)
		return () => mql.removeEventListener("change", cb)
	})

function* responsive_sm() {
	const chan = breakingPointChannel(`(min-width: ${tailwind.theme.screens.sm})`, "sm", "xs")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_md() {
	const chan = breakingPointChannel(`(min-width: ${tailwind.theme.screens.md})`, "md", "sm")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_lg() {
	const chan = breakingPointChannel(`(min-width: ${tailwind.theme.screens.lg})`, "lg", "md")
	while (true) {
		const breakpoint: BreakingPoint = yield take(chan)
		yield put(setBreakingPoint({ breakpoint }))
	}
}

function* responsive_xl() {
	const chan = breakingPointChannel(`(min-width: ${tailwind.theme.screens.xl})`, "xl", "lg")
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
