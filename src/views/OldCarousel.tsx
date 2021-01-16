import { useState, useRef, useLayoutEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import chroma from "chroma-js"
import Page from "~/components/Page"
import { FormattedMessage } from "react-intl"
import "twin.macro"

const colors = ["#48bb78", "#4299e1", "#f56565", "#ed8936", "#9f7aea"]

const CarouselPage = () => {
	return (
		<Page>
			<h2 tw="text-3xl mt-8 mb-2 font-black capitalize">
				<FormattedMessage id="nav_carousel" />
			</h2>
			<Carousel />
		</Page>
	)
}

// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
const ResizeObserver = window["ResizeObserver"]

const Carousel = () => {
	const [isDragging, setDragging] = useState(false)
	const dragOriginX = useMotionValue(0)
	const x = useMotionValue(0)

	// https://github.com/framer/motion/issues/513

	const [index, setI] = useState(0)
	// workaround for useTransform
	const i = useRef(0)
	function setIndex(index: number) {
		i.current = index
		setI(index)
	}

	const viewport = useRef<HTMLDivElement>()
	const container = useRef<HTMLDivElement>()

	const [width, setW] = useState(0)
	// workaround for useTransform
	const w = useRef(0)
	function setWidth(width: number) {
		w.current = width
		setW(width)
	}

	useLayoutEffect(() => {
		const el = viewport.current
		w.current = el.clientWidth
		setWidth(w.current)
		const resizeObserver = new ResizeObserver(entries => {
			for (const { contentRect } of entries) {
				setWidth(contentRect.width)
			}
		})
		resizeObserver.observe(el)
		return () => {
			resizeObserver.unobserve(el)
			resizeObserver.disconnect()
		}
	}, [])

	const background = useTransform(x, delta => {
		const index = i.current
		const width = w.current
		const ratio = Math.abs(delta / width)
		const bg =
			delta >= 0
				? chroma.mix(colors[index], colors[index - 1 >= 0 ? index - 1 : 0], ratio)
				: chroma.mix(colors[index], colors[index + 1 < colors.length ? index + 1 : colors.length - 1], ratio)
		return bg.darken(0.4).css()
	})

	const color = useTransform(background, value => {
		try {
			return chroma(value).luminance() < 0.5 ? "#f7fafc" : "#1a202c"
		} catch {
			return "#f7fafc"
		}
	})

	return (
		<motion.div
			ref={viewport}
			tw="relative text-center select-none overflow-hidden"
			style={{
				background,
				color,
				lineHeight: "100px",
				left: 0,
				right: 0,
				height: 500,
			}}
		>
			{index}
			<motion.div
				ref={container}
				tw="absolute flex"
				style={{
					top: "30%",
					left: -(index * width),
					x,
					width: `calc(${colors.length} * 100%)`,
				}}
				drag="x"
				dragConstraints={{ left: 0, right: 0 }}
				onDrag={(e, { point }) => {
					const distance = Math.abs(point.x)
					if (distance > width / 2) {
						const delta = (point.x > 0 ? -1 : 1) * Math.floor((distance + width / 2) / width)

						if (index + delta < 0 || index + delta >= colors.length) {
							return
						}
						setIndex(index + delta)
					}
				}}
				// dragOriginX={dragOriginX}
				onDragStart={() => setDragging(true)}
				onDragEnd={() => setDragging(false)}
				dragElastic={1}
				// positionTransition={({ delta }) => {
				// 	if (isDragging) {
				// 		const t = dragOriginX.get() + (1 / 1) * delta.x
				// 		dragOriginX.set(t)
				// 		return false
				// 	}
				// 	return { type: "spring", damping: 100 }
				// }}
			>
				{colors.map((c, i) => (
					<div
						key={i}
						tw="text-center shadow-lg font-bold text-2xl"
						css={{
							width: `calc(100% / ${colors.length})`,
							height: "16rem",
							lineHeight: "16rem",
							background: colors[i],
							color: chroma(colors[i]).luminance() < 0.5 ? "#f7fafc" : "#1a202c",
						}}
					>
						{i}
					</div>
				))}
			</motion.div>
		</motion.div>
	)
}

export default CarouselPage
