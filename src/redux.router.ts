import { createBrowserHistory, createPath } from "history"
import { useEffect } from "react"
import { useAction, useSelector } from "~/store/hooks"

export const history = createBrowserHistory()

export function useReduxHistory() {
	const { onListen } = useAction().history
	useEffect(() => {
		const dispose = history.listen(location => {
			onListen(location)
		})
		return () => {
			dispose()
		}
	}, [onListen])

	const action = useSelector(state => state.history.action)
	const path = useSelector(state => createPath(state.history.location))
	useEffect(() => {
		switch (action) {
			case "PUSH":
				history.push(path)
		}
	}, [path, action])
}
