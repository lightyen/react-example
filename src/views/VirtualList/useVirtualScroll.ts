import { useMemo, useRef, useLayoutEffect } from "react"
import { useScrollTop } from "~/components/ScrollBar"

export interface VirtualItem {
	height: number
}

function searchStart(accHeights: number[], value: number) {
	let mid = 0
	for (let i = 0, j = accHeights.length - 1; i < j; mid = Math.floor((i + j) / 2)) {
		mid = Math.floor((i + j) / 2)
		if (value > accHeights[mid]) {
			i = mid + 1
		} else {
			j = mid - 1
		}
	}
	return value <= accHeights[mid] ? mid : mid + 1
}

interface VirtualOption {
	scrollbar: HTMLElement
	data: VirtualItem[]
	offsetTop?: number
	minDisplay?: number
}

export function useVirtualScroll({ scrollbar, data, offsetTop = 0, minDisplay = 0 }: VirtualOption) {
	const { clientHeight } = scrollbar
	const scrollTop = useScrollTop({ scrollbar })
	const accHeights = useMemo(() => {
		const array = new Array<number>(data.length)
		for (let i = 0, length = data.length, acc = 0; i < length; i++) {
			acc += data[i].height
			array[i] = acc
		}
		return array
	}, [data])

	const base = scrollTop - offsetTop
	const start = searchStart(accHeights, base)
	let end = accHeights.length
	for (let j = start; j < end; j++) {
		if (accHeights[j] > base + clientHeight) {
			end = j + 1
			break
		}
	}

	const display = end - start
	if (display < minDisplay) {
		let remain = minDisplay - display
		if (end + remain <= data.length) {
			end += remain
			remain -= remain
		} else {
			end = data.length
		}
	}
	const totalHeight = accHeights[accHeights.length - 1] ?? 0
	const paddingTop = accHeights[start - 1] ?? 0

	return {
		start,
		end,
		accHeights,
		scrollbar,
		scrollTop,
		clientHeight,
		totalHeight,
		paddingTop,
	}
}

export type VirtualScrollProps = ReturnType<typeof useVirtualScroll>

interface UseStayOptions {
	offsetTop?: number
}

export function useStay({
	scrollbar,
	accHeights,
	start: index,
	scrollTop,
	offsetTop = 0,
}: VirtualScrollProps & UseStayOptions) {
	const base = scrollTop + offsetTop
	const delta = accHeights[index] - base
	const cache = useRef(accHeights)
	const memory = useRef({ index, delta })
	useLayoutEffect(() => {
		if (cache.current !== accHeights) {
			cache.current = accHeights
			const { index, delta } = memory.current
			if (index > 0) {
				const top = accHeights[index] + offsetTop - delta
				scrollbar.scrollTo({ top })
			}
		}
		return () => {
			memory.current = { index: cache.current !== accHeights ? memory.current.index : index, delta }
		}
	}, [scrollbar, offsetTop, accHeights, index, delta])
}
