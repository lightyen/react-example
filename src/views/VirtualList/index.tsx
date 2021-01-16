import { useEffect, useState, useRef, useReducer, useMemo, createContext, useContext, useCallback } from "react"
import chroma from "chroma-js"
import { FormattedMessage } from "react-intl"
import { useVirtualScroll, useStay, VirtualItem, VirtualScrollProps } from "./useVirtualScroll"
import { useScrollBarSource } from "~/components/ScrollBar"
import Page from "~/components/Page"
import Button from "~/components/Button"
import { spinner } from "../styles"
import "twin.macro"

function outerHeight(target: HTMLElement) {
	const marginTop = parseInt(document.defaultView.getComputedStyle(target).getPropertyValue("margin-top"))
	const marginBottom = parseInt(document.defaultView.getComputedStyle(target).getPropertyValue("margin-bottom"))
	return target.getBoundingClientRect().height + marginTop + marginBottom
}

interface Item extends VirtualItem {
	color: string
	background: string
}

function randomItem(): Item {
	const background = chroma.random().brighten().hex()
	const color = chroma(background).luminance() < 0.5 ? "#f7fafc" : "#1a202c"
	return { background, color, height: Math.round(200.0 * (Math.random() + 1.0)) }
}

function createData(size = 20000) {
	console.log("create large data:", size)
	console.time("create large data")
	const data = new Array<Item>(size)
	while (size--) data[size] = randomItem()
	console.timeEnd("create large data")
	return data
}

interface MyContextState {
	offsetTop: number
	data: Item[]
}

interface ChangeDataAction {
	type: "CHANGE_DATA"
	data: Item[]
}

interface ChangeOffsetTopAction {
	type: "CHANGE_OFFSETTOP"
	offsetTop: number
}

type MyContextAction = ChangeDataAction | ChangeOffsetTopAction

interface MyContextType extends MyContextState {
	dispatch: React.Dispatch<MyContextAction>
}

const MyContext = createContext<MyContextType>(null)

function reducer(state: MyContextState, action: MyContextAction) {
	switch (action.type) {
		case "CHANGE_DATA":
			return { ...state, data: action.data }
		case "CHANGE_OFFSETTOP":
			return { ...state, offsetTop: action.offsetTop }
		default:
			throw new Error("action is not implement")
	}
}

function useMyContext() {
	const { dispatch, ...state } = useContext(MyContext)
	const changeData = useCallback((data: Item[]) => dispatch({ type: "CHANGE_DATA", data }), [dispatch])
	const changeOffsetTop = useCallback((offsetTop: number) => dispatch({ type: "CHANGE_OFFSETTOP", offsetTop }), [
		dispatch,
	])
	return { ...state, changeData, changeOffsetTop }
}

const VirtualList = () => {
	const { data, offsetTop, changeOffsetTop } = useMyContext()
	const scrollbar = useScrollBarSource()
	const container = useRef<HTMLDivElement>()
	useEffect(() => {
		const e = container.current
		const marginTop = parseInt(
			document.defaultView.getComputedStyle(e.parentElement).getPropertyValue("margin-top"),
		)
		changeOffsetTop(e.offsetTop + marginTop)
	}, [changeOffsetTop])

	const virtual = useVirtualScroll({
		scrollbar,
		data,
		offsetTop,
		// minDisplay: 5,
	})
	useStay({ ...virtual })
	const { start, end, paddingTop, totalHeight } = virtual

	return (
		<div ref={container} tw="relative">
			<Information {...virtual} />
			<div tw="relative" css={{ height: totalHeight }}>
				<div
					tw="relative"
					css={{
						willChange: "transform",
						transform: `translateY(${paddingTop}px)`,
					}}
				>
					{data.slice(start, end).map(({ ...style }, i) => (
						<div key={start + i} tw="flex flex-col items-center text-2xl pt-6" style={style}>
							<div>{start + i}</div>
							<div css={spinner} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

function scrollTo(options: {
	index: number
	accHeights: number[]
	scrollbar: HTMLElement
	offsetTop?: number
	behavior?: "auto" | "smooth"
}) {
	const { scrollbar, accHeights, index, offsetTop = 0, behavior = "auto" } = options
	if (index != undefined) {
		const top = (accHeights[index - 1] ?? 0) + offsetTop
		scrollbar.scrollTo({ top, behavior })
	}
}

const Information = ({ scrollTop, start, end, accHeights, scrollbar }: VirtualScrollProps) => {
	const { offsetTop, changeData } = useMyContext()
	const input = useRef(0)
	const ref = useRef<HTMLDivElement>()

	const [marginBottom, setMarginBottom] = useState(0)
	useEffect(() => {
		setMarginBottom(-outerHeight(ref.current))
	}, [])

	return (
		<div ref={ref} tw="sticky text-xl text-gray-600 w-4/5 mx-auto" css={{ top: "1rem", marginBottom, zIndex: 1 }}>
			<div tw="p-3 bg-gray-300" css={{ background: "#e2e8f0", opacity: 0.7 }}>
				<Button
					variant="blue"
					onClick={e =>
						scrollTo({
							scrollbar,
							accHeights,
							index: input.current,
							offsetTop,
							behavior: "smooth",
						})
					}
				>
					Goto
				</Button>
				<input
					tw="border-gray-300 rounded-lg mx-3 py-2 px-4"
					type="number"
					defaultValue={0}
					onChange={e => {
						if (/^\d+$/.test(e.target.value)) {
							const x = parseInt(e.target.value)
							if (x >= 0 && x < accHeights.length) {
								input.current = x
							} else {
								input.current = undefined
							}
						}
					}}
					onKeyDown={e => {
						if (e.key === "Enter") {
							scrollTo({
								scrollbar,
								accHeights,
								index: input.current,
								offsetTop,
								behavior: "smooth",
							})
						}
					}}
				/>
				<Button variant="blue" onClick={e => changeData(createData())}>
					Create
				</Button>
				<div tw="mt-3">Items: {accHeights.length}</div>
				<div>ScrollTop: {scrollTop}px</div>
				<div>Start: {start}</div>
				<div>End: {end}</div>
				<div>Delta: {accHeights[start] - scrollTop + offsetTop}px</div>
				<div>Display: {end - start}</div>
				<div>OffsetTop: {offsetTop}px</div>
			</div>
		</div>
	)
}

const VirtualListPage = () => {
	const [state, dispatch] = useReducer(reducer, null, () => ({ offsetTop: 0, data: createData() }))
	const value = useMemo(() => ({ ...state, dispatch }), [state, dispatch])
	return (
		<MyContext.Provider value={value}>
			<Page tw="m-3 pt-3 px-3 pb-6 relative">
				<h2 tw="text-3xl mt-8 mb-5 font-black">
					<FormattedMessage id="nav_virtual_list" />
				</h2>
				<VirtualList />
			</Page>
		</MyContext.Provider>
	)
}

export default VirtualListPage
