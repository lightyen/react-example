import { Action, createAction } from "@reduxjs/toolkit"
import axios, { AxiosResponse } from "axios"
import { call, put, takeEvery } from "redux-saga/effects"
import { fetchGithubIssues, fetchGithubIssuesSuccess } from "./action"

function get(handler: (resp: AxiosResponse) => Action, ...param: Parameters<typeof axios.get>) {
	return function* (action: Action) {
		try {
			const resp = yield call(axios.get, ...param)
			yield put(handler(resp))
			handler(resp)
		} catch {
			// catch error
		}
	}
}

function takeEveryGet(from: ReturnType<typeof createAction>, ...param: Parameters<typeof get>) {
	return takeEvery(from, get(...param))
}

export default function* saga() {
	yield takeEveryGet(
		fetchGithubIssues,
		resp => fetchGithubIssuesSuccess({ issues: resp.data }),
		`https://api.github.com/repos/facebook/react/issues?state=all&page=1`,
	)
}
