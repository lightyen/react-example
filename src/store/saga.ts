import { fork } from "redux-saga/effects"
import app from "./app/saga"
import data from "./data/saga"
import history from "./history/saga"

export default function* root() {
	yield fork(app)
	yield fork(data)
	yield fork(history)
}
