import { useEffect, useState, useRef, useCallback } from "react"
import { useFiltersSelector, useFiltersAction } from "./store"
import { FilterType } from "./store/filter/model"

export type SortType = "none" | "ascending" | "descending" | undefined
export type Sorter<T> = (a: T, b: T) => number
export type WithCheckbox<RecordType> = RecordType & { __checkbox__: boolean }

export interface BaseColumnProps<T> {
	sorter?: Sorter<T>
	filters?: Array<FilterType<T>>
}

interface TableOptions<T> {
	id: string
	data: T[]
	columns: Array<BaseColumnProps<T>>

	pageSize: number
	maxPageItem: number
	infiniteLoop: boolean
}

interface PaginationProps {
	total: number
	pageSize: number
	maxPageItem: number
	infiniteLoop: boolean
}

function usePagination({ total, pageSize, maxPageItem, infiniteLoop }: PaginationProps) {
	const [_pageIndex, setPageIndex] = useState(0)

	const pageCount = Math.ceil(total / pageSize)

	let start = Math.floor(_pageIndex / maxPageItem) * maxPageItem

	const pageIndex = start >= pageCount ? 0 : _pageIndex
	start = start >= pageCount ? 0 : start

	const end = start + maxPageItem > pageCount ? pageCount : start + maxPageItem
	const hasMorePrevPage = pageIndex >= maxPageItem
	const hasMoreNextPage = start + maxPageItem < pageCount
	const disablePrevious = !infiniteLoop && pageIndex === 0
	const disableNext = !infiniteLoop && pageIndex + 1 >= total / pageSize

	const links = new Array<number>(end - start)
	for (let i = 0; i < end - start; i++) {
		links[i] = start + i
	}

	const gotoPage = useCallback(
		(index: number) => {
			if (pageIndex !== index) {
				setPageIndex(index)
			}
		},
		[pageIndex, setPageIndex],
	)

	const len = useRef(total)
	useEffect(() => {
		if (len.current > total) {
			gotoPage(0)
		}
		return () => {
			len.current = total
		}
	}, [gotoPage, total, _pageIndex, pageSize])

	function previousPage() {
		if (pageIndex > 0) {
			setPageIndex(pageIndex - 1)
		} else if (infiniteLoop) {
			const pages = Math.ceil(total / pageSize)
			if (pages) {
				const p = (pages - 1) % pages
				if (pageIndex !== p) {
					setPageIndex(p)
				}
			}
		}
	}

	function nextPage() {
		if (pageIndex + 1 < total / pageSize) {
			setPageIndex(pageIndex + 1)
		} else if (infiniteLoop && pageIndex) {
			setPageIndex(0)
		}
	}

	return {
		pageIndex,
		pageCount,
		links,
		gotoPage,
		previousPage,
		nextPage,
		hasMorePrevPage,
		hasMoreNextPage,
		disablePrevious,
		disableNext,
	}
}

interface SortProps<T> {
	columns: Array<BaseColumnProps<T>>
}

function sorting<T>(data: T[], columns: Array<BaseColumnProps<T>>, sortKeys: SortType[]) {
	const i = sortKeys.findIndex(p => p && p !== "none")
	if (i < 0) {
		return data.slice()
	}
	const sorter = columns[i].sorter
	if (sortKeys[i] === "ascending") {
		return data.slice().sort(sorter)
	} else {
		return data.slice().sort((a, b) => -sorter(a, b))
	}
}

function useSort<T>({ columns }: SortProps<T>) {
	const [sortTypes, setSortTypes] = useState<SortType[]>(columns.map(c => (c.sorter ? "none" : undefined)))
	function nextSortType(col: number) {
		function newTypes(t: SortType) {
			const keys = sortTypes.slice()
			for (let i = 0, len = keys.length; i < len; i++) {
				keys[i] = i === col ? t : keys[i] != undefined ? "none" : undefined
			}
			return keys
		}
		switch (sortTypes[col]) {
			case "ascending":
				setSortTypes(newTypes("descending"))
				break
			case "descending":
				setSortTypes(newTypes("ascending"))
				break
			default:
				setSortTypes(newTypes("ascending"))
				break
		}
	}

	return { sortTypes, nextSortType }
}

function exhaustiveCheck(value: never) {
	throw new Error(`Exhaustive check is not passed: ${value}`)
}

function filtering<T>(data: readonly T[], columns: Array<BaseColumnProps<T>>, filterKeys: { [id: string]: unknown }) {
	return data.filter(record => {
		return columns.every((col, i) => {
			// for every filter
			if (!col.filters || col.filters.length == 0) {
				return true
			}
			for (let k = 0; k < col.filters.length; k++) {
				const f = col.filters[k]
				if (!f) {
					continue
				}
				const input = filterKeys[`${i}-${k}`]
				if (!input) {
					continue
				}
				switch (f.type) {
					case "pattern":
						if (typeof input === "string") {
							if (!f.filter(input, record)) {
								return false
							}
						}
						break
					case "select":
						switch (f.isMulti) {
							case true:
								if (input instanceof Array && !f.filter(input, record)) {
									return false
								}
								break
							case false:
								if (!f.filter(input, record)) {
									return false
								}
								break
							default:
								exhaustiveCheck(f)
						}
						break
					default:
						exhaustiveCheck(f)
				}
			}
			return true
		})
	})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
	const handle = useRef<number>()
	return useCallback(
		(...args: Parameters<T>) => {
			window.clearTimeout(handle.current)
			handle.current = window.setTimeout(() => callback(...args), delay)
		},
		[callback, delay],
	)
}

import { shallowEqual } from "react-redux"

function useFilterInputs({ id }: { id: string }) {
	const filterInputs = useFiltersSelector(state => state[id].inputs)
	const { setInput } = useFiltersAction()

	function setFilterInput(fid: string, inputValue: unknown) {
		if (filterInputs[fid] !== inputValue) {
			setInput({ id, fid, value: inputValue })
		}
	}

	// debounce
	const [inputs, setInputs] = useState(filterInputs)
	const debounceChange = useDebounce(setInputs, 200)
	useEffect(() => {
		if (!shallowEqual(inputs, filterInputs)) {
			debounceChange(filterInputs)
		}
	}, [debounceChange, inputs, filterInputs])

	return { filterInputs, setFilterInput }
}

export function useTable<T = unknown>({ id, data, columns, pageSize, maxPageItem, infiniteLoop }: TableOptions<T>) {
	const { sortTypes, nextSortType } = useSort<T>({ columns })
	const { filterInputs, setFilterInput } = useFilterInputs({ id })

	const rows = sorting(filtering(data, columns, filterInputs), columns, sortTypes)

	const { pageIndex, gotoPage, ...pagination } = usePagination({
		total: rows.length,
		pageSize,
		maxPageItem,
		infiniteLoop,
	})

	const page = rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

	// checkbox
	const enableCheckbox = data.length > 0 && data.every(d => Object.prototype.hasOwnProperty.call(d, "__checkbox__"))
	const allChecked = enableCheckbox && (rows as Array<WithCheckbox<T>>).every(d => d.__checkbox__)
	const [c, setC] = useState(false)

	return {
		rows,
		sortTypes,
		nextSortType,
		setFilterInput,
		page,
		pageIndex,
		gotoPage,
		...pagination,
		enableCheckbox,
		allChecked,
		setAllChecked: (checked: boolean) => {
			const list = rows as Array<WithCheckbox<T>>
			list.forEach(d => {
				d.__checkbox__ = checked
			})
			setC(!c)
			return data.slice() as Array<WithCheckbox<T>>
		},
		setChecked: (record: WithCheckbox<T>, checked: boolean) => {
			record.__checkbox__ = checked
			setC(!c)
			const list = data as Array<WithCheckbox<T>>
			return list.slice()
		},
	}
}
