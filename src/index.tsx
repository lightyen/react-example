import { StrictMode } from "react"
import { render } from "react-dom"
import App from "~/App"
import { createInstance } from "localforage"

import { makeStore } from "~/store/store"

const store = createInstance({ name: "app" })

store.getItem("test", (err, value) => {
	render(
		<StrictMode>
			<App store={makeStore()} />
		</StrictMode>,
		document.getElementById("root"),
	)
})
