import { useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Styles } from "react-select"
import Select from "react-select"
import { useIntl } from "react-intl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes"
import { useFiltersSelector, useFiltersAction } from "./store"
import tw, { css } from "twin.macro"

export interface CustomOption {
	label: string
	value: unknown
}

interface Props {
	tabIndex: number
	id: string
	fid: string
	label: React.ReactNode
	onCancel(): void
	styles?: Partial<Styles>
	options: readonly CustomOption[]
	isMulti?: boolean
	onChange(value: unknown): void
}

export const FilterSelect = ({ tabIndex, label, options, styles, isMulti, onChange, onCancel, id, fid }: Props) => {
	const container = useRef<HTMLDivElement>()
	const intl = useIntl()
	const focus = useFiltersSelector(state => state[id].focus[fid] ?? true)
	const inputOption = useFiltersSelector(state => state[id].inputs[fid] ?? "")
	const { setFocus } = useFiltersAction()

	const input = inputOption as unknown
	const inputs = inputOption as unknown[]
	const value = isMulti ? options.filter(o => inputs.includes(o.value)) : options.find(o => o.value === input)

	const exit = useCallback(
		(e: MouseEvent) => {
			if (e.target instanceof Node) {
				if (!container.current.contains(e.target)) {
					setFocus({ id, fid, focus: false })
					if (onCancel && (!value || (value instanceof Array && value.length === 0))) {
						onCancel()
					}
				}
			}
		},
		[id, fid, setFocus, onCancel, value],
	)

	const mount = useRef(false)
	useEffect(() => {
		if (focus && mount.current) {
			window.addEventListener("mousedown", exit)
		}
		return () => {
			if (focus) {
				window.removeEventListener("mousedown", exit)
			}
		}
	}, [focus, exit])

	return (
		<div tw="mb-2 mr-3 sm:h-12 outline-none" tabIndex={tabIndex}>
			{focus && (
				<motion.div
					initial={{ opacity: 0.7, scaleY: 0.7, zIndex: 999 }}
					animate={{ opacity: 1, scaleY: 1, transition: { duration: 0.13 } }}
					onAnimationStart={() => {
						mount.current = false
					}}
					onAnimationComplete={() => {
						window.addEventListener("mousedown", exit)
						mount.current = true
					}}
				>
					<div ref={container} css={{ minWidth: 200 }}>
						<label tw="capitalize font-bold">{label}</label>
						<Select
							value={value}
							options={options}
							isMulti={isMulti}
							menuIsOpen
							isSearchable
							isClearable
							placeholder={intl.formatMessage({ id: "select_placeholder" })}
							noOptionsMessage={() => intl.formatMessage({ id: "select_no_options" })}
							styles={styles}
							onChange={value => {
								if (isMulti) {
									const v = (value || []) as CustomOption[]
									onChange(v.map(a => a.value))
								} else {
									const v = value as CustomOption
									onChange(v?.value)
								}
							}}
						/>
					</div>
				</motion.div>
			)}
			{!focus && (
				<motion.button
					css={[
						tw`transition ease-in-out! duration-200! rounded bg-blue-500 text-white leading-none px-4 py-2`,
						css`
							:hover,
							:focus {
								box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
								${tw`outline-none`}
							}
						`,
					]}
					initial={{ scaleY: 0.4 }}
					animate={{ opacity: 1, scaleY: 1, transition: { duration: 0.13 } }}
					onMouseDown={e => {
						setFocus({ id, fid, focus: true })
					}}
				>
					<span
						css={css`
							transition: all ease 0.16s;
							${tw`pr-2`}
							:hover {
								color: #ee2200;
							}
						`}
						title={intl.formatMessage({ id: "clear" })}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
							onChange(undefined)
							onCancel && onCancel()
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</span>
					<span tw="capitalize">{label}</span>
					{isMulti
						? inputs && <span>: &quot;{inputs.map(v => v).join(",")}&quot;</span>
						: input && <span>: &quot;{input}&quot;</span>}
				</motion.button>
			)}
		</div>
	)
}
