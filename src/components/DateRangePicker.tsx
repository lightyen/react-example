import { useEffect, useState, useRef } from "react"

import { motion } from "framer-motion"
import { DateRangePicker } from "react-date-range"

import format from "~/date/format"
import { useIntl } from "react-intl"
import {
	startOfDay,
	endOfDay,
	startOfToday,
	endOfToday,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	subDays,
	endOfMonth,
} from "date-fns"
import { getDateLocale } from "~/date/locale"
import { css, Interpolation, Theme } from "@emotion/react"

import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { Global } from "@emotion/react"
import tw from "twin.macro"

const globalStyles = css`
	.rdrStaticRangeLabel,
	.rdrWeekDay,
	.rdrDayNumber {
		${tw`font-black text-gray-700`}
	}
	.rdrStaticRangeLabel:first-letter {
		${tw`uppercase`}
	}
`

export interface DateRange {
	startDate: Date
	endDate: Date
}

interface DateRangeChangeEvent {
	selection: DateRange
}

interface RangeWithKey extends DateRange {
	key: string
}

type StaticRangeLabel = {
	label: string
	startDate: Date
	endDate: Date
}

interface Props {
	css?: Interpolation<Theme>
	tw?: string
	range?: DateRange
	onChange?(range: DateRange): void
}

export const CustomDateRangePicker = ({ range, onChange, ...props }: Props) => {
	const ref = useRef<HTMLDivElement>()
	const intl = useIntl()

	const st = startOfToday()
	const et = endOfToday()

	const statics: StaticRangeLabel[] = [
		{ label: intl.formatRelativeTime(0, "day", { numeric: "auto" }), startDate: st, endDate: et },
		{
			label: intl.formatRelativeTime(-1, "day", { numeric: "auto" }),
			startDate: subDays(st, 1),
			endDate: subDays(et, 1),
		},
		{
			label: intl.formatRelativeTime(0, "week", { numeric: "auto" }),
			startDate: startOfWeek(st),
			endDate: endOfWeek(et),
		},
		{
			label: intl.formatRelativeTime(0, "month", { numeric: "auto" }),
			startDate: startOfMonth(st),
			endDate: endOfMonth(et),
		},
	]

	const [focus, setFocus] = useState(false)
	const [ranges, setRanges] = useState<RangeWithKey[]>([
		{
			key: "selection",
			startDate: range?.startDate || st,
			endDate: range?.endDate || et,
		},
	])

	const { startDate, endDate } = ranges[0]

	useEffect(() => {
		const exit = (e: MouseEvent) => {
			if (focus && e.target instanceof Node) {
				!ref.current.contains(e.target) && setFocus(false)
			}
		}
		if (focus) {
			window.addEventListener("mousedown", exit)
		}
		return () => {
			if (focus) {
				window.removeEventListener("mousedown", exit)
			}
		}
	}, [focus])

	function onSelect(e: DateRangeChangeEvent) {
		let {
			selection: { startDate, endDate },
		} = e
		startDate = startOfDay(startDate)
		endDate = endOfDay(endDate)

		setRanges([
			{
				key: "selection",
				startDate,
				endDate,
			},
		])
		onChange && onChange({ startDate, endDate })
	}

	return (
		<>
			<Global styles={globalStyles} />
			<div tw="relative">
				{focus && (
					<motion.div
						tw="absolute border z-10"
						css={[
							css`
								box-shadow: 2px 2px 12px -1px rgba(var(--theme-shadow)),
									0px 0px 6px 0px rgba(var(--theme-shadow-ambient));
							`,
							{ top: "-0.5rem", left: "-0.375rem" },
						]}
						ref={ref}
						initial={{ opacity: 0.7, y: "-1rem" }}
						animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
					>
						<DateRangePicker
							locale={getDateLocale()}
							onChange={onSelect}
							ranges={ranges}
							inputRanges={[]}
							renderStaticRangeLabel={(e: StaticRangeLabel) => e.label}
							staticRanges={statics.map(v => ({
								hasCustomRendering: true,
								label: v.label,
								range: () => ({
									startDate: v.startDate,
									endDate: v.endDate,
								}),
								isSelected(e: RangeWithKey) {
									if (
										e.startDate.getTime() === v.startDate.getTime() &&
										e.endDate.getTime() === v.endDate.getTime()
									) {
										return true
									}
									return false
								},
							}))}
						/>
					</motion.div>
				)}
				<button onMouseDown={() => setFocus(true)} {...props}>
					{format(startDate, "PPP")} ~ {format(endDate, "PPP")}
				</button>
			</div>
		</>
	)
}
