import { useEffect, useState, useRef, useCallback } from "react"
import Select from "react-select"
import { motion } from "framer-motion"
import { FormattedMessage, useIntl } from "react-intl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter"
import tw, { styled } from "twin.macro"

const AddFilerButton = styled.button`
	${tw`transition ease-in-out! duration-200! rounded bg-green-500 px-4 py-2 text-white font-bold leading-none whitespace-nowrap`}

	:hover, :focus {
		box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5);
		${tw`outline-none`}
	}
`

export interface OptionType<T> {
	label: React.ReactNode
	value: T
}

interface Props<T = string> {
	tabIndex: number
	options: Array<OptionType<T>>
	onChange?(value: T): void
}

function useFocusExit() {
	const [focus, setFocus] = useState(false)
	const ref = useRef<HTMLDivElement>()
	const exit = useCallback((e: MouseEvent) => {
		if (e.target instanceof Node) {
			!ref.current.contains(e.target) && setFocus(false)
		}
	}, [])
	useEffect(() => {
		return () => {
			if (focus) {
				window.removeEventListener("mousedown", exit)
			}
		}
	}, [exit, focus])
	return { ref, exit, focus, setFocus }
}

export const AddFilter = ({ tabIndex, options, onChange }: Props) => {
	const intl = useIntl()
	const { focus, setFocus, exit, ref } = useFocusExit()
	return (
		<div tw="mb-2 mr-3 sm:h-12 outline-none" tabIndex={tabIndex}>
			{focus && (
				<motion.div
					initial={{ scaleY: 0.7, opacity: 0.5 }}
					animate={{ scaleY: 1, opacity: 1, transition: { duration: 0.15 } }}
					onAnimationComplete={() => window.addEventListener("mousedown", exit)}
				>
					<div ref={ref} css={{ width: 180 }}>
						<Select
							menuIsOpen
							isSearchable
							isClearable={false}
							options={options}
							placeholder={intl.formatMessage({ id: "select_placeholder" })}
							noOptionsMessage={() => intl.formatMessage({ id: "select_no_options" })}
							styles={{
								option: style => ({ ...style, whiteSpace: "nowrap" }),
							}}
							onChange={v => {
								onChange && onChange(v["value"])
								setFocus(false)
							}}
						/>
					</div>
				</motion.div>
			)}
			{!focus && (
				<AddFilerButton onMouseDown={e => setFocus(true)}>
					<FontAwesomeIcon icon={faFilter} />
					<span tw="pl-2 whitespace-nowrap">
						<FormattedMessage id="add_filter" />
					</span>
				</AddFilerButton>
			)}
		</div>
	)
}
