import type { loader } from "webpack"

const customLoader: loader.Loader = function (content, map) {
	var callback = this.async()
	console.log("custom loader!")
	// callback(null, result)
}

export default customLoader
