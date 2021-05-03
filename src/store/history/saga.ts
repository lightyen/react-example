import { History } from "history"
import { delay, fork, select } from "redux-saga/effects"
export default function* history() {
	yield fork(function* () {
		yield delay(5000)
		const history: History = yield select(state => state.history.history)
		history.push("/transition")
	})
}
