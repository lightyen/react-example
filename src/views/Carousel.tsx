import { useState } from "react"
import { FormattedMessage } from "react-intl"
import Page from "~/components/Page"
import "twin.macro"
import { motion, useMotionValue } from "framer-motion"

export default function Carousel() {
	return (
		<Page>
			<h2 tw="text-3xl mt-8 mb-2 font-black capitalize">
				<FormattedMessage id="nav_carousel" />
			</h2>
			<div tw="relative">
				<Box />
			</div>
		</Page>
	)
}

interface Item {
	background: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const items: Item[] = [
	{
		background: "#48bb78",
	},
	{
		background: "#4299e1",
	},
	{
		background: "#f56565",
	},
	{
		background: "#ed8936",
	},
	{
		background: "#9f7aea",
	},
]

const Box = () => {
	const [isDragging, setDragging] = useState(false)
	const x = useMotionValue(0)
	const width = 300
	const [index, setIndex] = useState(0)
	return (
		<motion.div
			layout
			tw="relative flex cursor-pointer bg-gray-600"
			drag="x"
			dragElastic={1}
			onDrag={(e, { offset }) => {
				if (Math.abs(offset.x) > width / 2) {
					const d = (offset.x > 0 ? -1 : 1) * Math.floor((Math.abs(offset.x) + width / 2) / width)
					console.log(index + d)
					if (index + d < 0 || index + d >= 2) {
						return
					}
					setIndex(index + d)
				}
			}}
			style={{
				x,
				width: 300,
				left: -(index * width),
			}}
			dragConstraints={{ left: 0, right: 0 }}
			onDragStart={() => setDragging(true)}
			onDragEnd={() => setDragging(false)}
		>
			ABCDE{isDragging ? "on" : "off"}
		</motion.div>
	)
}
