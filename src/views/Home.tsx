import { animated, Globals, useSpring } from "@react-spring/web"
import "dayjs/locale/zh-tw"
import { useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import "twin.macro"
import ReactLogo from "~/assets/logo.svg"
import Page from "~/components/Page"

Globals.assign({
	skipAnimation: false,
})

function A() {
	const [open, toggle] = useState(false)
	const width = 256
	const props = useSpring({ width: open ? width : 0 })
	const ref = useRef<HTMLInputElement>(null)
	return (
		<div tw="">
			<div tw="w-64 relative" onClick={() => toggle(!open)}>
				<animated.div tw="absolute bg-blue-800 top-0 h-full" style={props} />
				<animated.div tw="relative bg-opacity-0 text-white text-center select-none">
					{props.width.to(x => x.toFixed(0))}
				</animated.div>
			</div>
		</div>
	)
}

export default function Home() {
	return (
		<Page>
			<ReactLogo
				tw="h-10 transition-colors bg-gray-700 hover:( ring ring-gray-600)
		bg-opacity-60
			  hover:background-color[rgba(87, 84, 88, var(--tw-bg-opacity))]
			"
			/>
			<FormattedMessage id="test" values={{ name: "React" }} />
			<A />
		</Page>
	)
}
