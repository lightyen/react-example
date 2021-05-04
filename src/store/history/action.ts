import { createAction } from "@reduxjs/toolkit"
import type { Location, Path } from "history"

function withPayloadType<T>() {
	return (t: T) => ({ payload: t })
}

export const onListen = createAction("@@router/listen", withPayloadType<Location>())
export const push = createAction("@@router/push", withPayloadType<Path>())
export const back = createAction("@@router/back")
export const replace = createAction("@@router/replace", withPayloadType<Path>())

export default { onListen }
