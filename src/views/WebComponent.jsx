import ReactDOM from "react-dom"
import Page from "~/components/Page"

// reference
// https://www.webcomponents.org/
// https://hacks.mozilla.org/2018/11/the-power-of-web-components/

const template = document.createElement("template")
template.innerHTML = `
<style>
.link {
	color: #222222;
	text-decoration: none;
}
.link:hover {
	color: #444444;
}
</style>`

window.customElements.define(
	"x-search",
	class extends HTMLElement {
		constructor() {
			super()
		}
		attributeChangedCallback() {
			//
		}
		connectedCallback() {
			const mountPoint = document.createElement("span")

			const search = this.getAttribute("search")
			const classes = this.getAttribute("class")
			const url = "https://www.google.com/search?q=" + encodeURIComponent(search)
			this.appendChild(mountPoint)
			ReactDOM.render(
				<a href={url} className={classes}>
					{search}
				</a>,
				mountPoint,
			)

			this.addEventListener("click", this.handleClick.bind(this))
		}

		disconnectedCallback() {
			this.removeEventListener("click", this.handleClick)
		}
		onSlotChange(e) {
			console.log("slot change", e)
		}
		adoptedCallback() {
			//
		}
		handleClick() {
			console.log("on click")
		}
	},
)

const WebComponentPage = () => {
	return (
		<Page>
			<x-search class="hover:underline" search="Test"></x-search>
		</Page>
	)
}

export default WebComponentPage
