import { createInstance } from "localforage"
import { StrictMode } from "react"
import { render } from "react-dom"
import App from "~/App"

const store = createInstance({ name: "app" })

store.getItem("test", (err, value) => {
	render(
		<StrictMode>
			<App />
		</StrictMode>,
		document.getElementById("root"),
	)
})
