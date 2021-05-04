import { delay, fork, put } from "redux-saga/effects"
import { push } from "./action"
export default function* history() {
	yield fork(function* () {
		yield delay(5000)
		yield put(push("/transition"))
	})
}
