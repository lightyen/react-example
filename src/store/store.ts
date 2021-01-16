import { configureStore } from "@reduxjs/toolkit"
import reducer from "./reducer"
import createSagaMiddleware from "redux-saga"
import rootSaga from "./saga"

// import { RootStore } from "./reducer"
// import { createEpicMiddleware } from "redux-observable"
// import { rootEpic } from "~/store/epic"
// import { switchMap } from "rxjs/operators"
// import { BehaviorSubject } from "rxjs"
// import { RootAction } from "./epic"

export function makeStore() {
	const sagaMiddleware = createSagaMiddleware()
	// const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootStore>()

	const store = configureStore({
		reducer,
		middleware: [sagaMiddleware],
		preloadedState: undefined,
		devTools: process.env.NODE_ENV === "development" ? { name: "react is awesome" } : false,
	})

	let sagaTask = sagaMiddleware.run(rootSaga)

	if (module.hot) {
		module.hot.accept("~/store/reducer", () => {
			console.log("@@HMR reducer")
			store.replaceReducer(reducer)
		})
		module.hot.accept("~/store/saga", () => {
			console.log("@@HMR saga")
			sagaTask.cancel()
			sagaTask.toPromise().then(() => {
				sagaTask = sagaMiddleware.run(rootSaga)
			})
		})
	}

	// const epic$ = new BehaviorSubject(rootEpic)
	// epicMiddleware.run((action$, state$, dep$) => epic$.pipe(switchMap(epic => epic(action$, state$, dep$))))
	// if (module.hot) {
	// 	module.hot.accept("~/store/epic" as string, () => {
	// 		console.log("@@HMR epic")
	// 		const nextRootEpic = require("~/store/epic").rootEpic
	// 		epic$.next(nextRootEpic)
	// 	})
	// }

	return store
}
