import { combineEpics, Epic } from "redux-observable"
import { Observable } from "rxjs"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { Action } from "./app/epic"
import { RootStore } from "./reducer"

export type RootAction = Action

import app from "./app/epic"

export const rootEpic: Epic<Action, Action, RootStore> = combineEpics(app)

export const fromAxios = (request: AxiosRequestConfig) =>
	new Observable<AxiosResponse>(observer => {
		const source = axios.CancelToken.source()
		axios({ ...request, cancelToken: source.token })
			.then(resp => {
				observer.next(resp)
				observer.complete()
			})
			.catch(err => observer.error(err))
		return () => source.cancel()
	})
