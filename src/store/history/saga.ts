import { delay, fork } from "redux-saga/effects"
export default function* history() {
	yield fork(function* () {
		yield delay(5000)
		// yield put(push("/transition"))
	})
}
