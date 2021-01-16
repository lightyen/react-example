import { takeEvery, call, put } from "redux-saga/effects"
import { fetchGithubIssues, fetchGithubIssuesSuccess } from "./action"
import axios, { AxiosResponse } from "axios"

function* task(action: ReturnType<typeof fetchGithubIssues>) {
	try {
		const { data }: AxiosResponse = yield call(
			axios.get,
			`https://api.github.com/repos/facebook/react/issues?state=all&page=1`,
		)
		yield put(fetchGithubIssuesSuccess({ issues: data }))
	} catch {
		// error
	}
}

export default function* saga() {
	yield takeEvery(fetchGithubIssues.type, task)
}
