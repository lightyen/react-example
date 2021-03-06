import { configureStore } from "@reduxjs/toolkit"
import { History } from "history"
import createSagaMiddleware from "redux-saga"
import createReducer from "./reducer"
import rootSaga from "./saga"
// import { RootStore } from "./reducer"
// import { createEpicMiddleware } from "redux-observable"
// import { rootEpic } from "~/store/epic"
// import { switchMap } from "rxjs/operators"
// import { BehaviorSubject } from "rxjs"
// import { RootAction } from "./epic"

export function makeStore(history: History) {
	const sagaMiddleware = createSagaMiddleware()
	// const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootStore>()

	const store = configureStore({
		reducer: createReducer(history),
		middleware: [sagaMiddleware],
		preloadedState: undefined,
		devTools: process.env.NODE_ENV === "development" ? { name: "react is awesome" } : false,
	})

	let saga = sagaMiddleware.run(rootSaga)

	if (module.hot) {
		module.hot.accept("./reducer", () => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			store.replaceReducer(require("./reducer")(history))
		})

		module.hot.accept("./saga", () => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const root = require("./saga")
			saga?.cancel()
			saga = null
			saga = sagaMiddleware.run(root)
		})
	}

	// NOTE: The statement 'module.hot?.accept' is not working.

	// if (module.hot) {
	// 	module.hot.accept("~/store/reducer", () => {
	// 		console.log("@@HMR reducer")
	// 		store.replaceReducer(reducer)
	// 	})
	// 	module.hot.accept("~/store/saga", () => {
	// 		console.log("@@HMR saga")
	// 		sagaTask.cancel()
	// 		sagaTask.toPromise().then(() => {
	// 			sagaTask = sagaMiddleware.run(rootSaga)
	// 		})
	// 	})
	// }

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
