import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useIntl } from "react-intl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes"
import { faBackspace } from "@fortawesome/free-solid-svg-icons/faBackspace"
import { useFiltersSelector, useFiltersAction } from "./store"
import { NormalInput } from "./NormalInput"
import tw, { css, styled } from "twin.macro"

const CloseButton = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	padding: 0 0.25rem;
	color: #222222;
	opacity: 0.5;
	transition: opacity ease-out 0.15s;
	cursor: pointer;
	&:hover {
		opacity: 1;
		color: #dd3300;
	}
`

interface FilterInputProps {
	tabIndex: number
	id: string
	fid: string
	label: React.ReactNode
	onChange(value: string): void
	onCancel(): void
}

export const FilterPattern = ({ tabIndex, label, onChange, onCancel, id, fid }: FilterInputProps) => {
	const container = useRef<HTMLDivElement>()
	const inputRef = useRef<HTMLInputElement>()
	const intl = useIntl()
	const input = useFiltersSelector(state => state[id].inputs[fid] ?? "") as string
	const focus = useFiltersSelector(state => state[id].focus[fid] ?? true)
	const { setFocus } = useFiltersAction()
	useEffect(() => {
		const exit = (e: MouseEvent) => {
			if (focus && e.target instanceof Node) {
				if (!container.current.contains(e.target)) {
					setFocus({ id, fid, focus: false })
					onCancel && input === "" && onCancel()
				}
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
	}, [id, fid, focus, setFocus, input, onCancel])

	return (
		<div tw="mb-2 mr-3 sm:h-12 outline-none" tabIndex={tabIndex}>
			{focus && (
				<motion.div
					initial={{ opacity: 0.7, scaleY: 0.7 }}
					animate={{ opacity: 1, scaleY: 1, transition: { duration: 0.13 } }}
					onAnimationComplete={() => inputRef.current.focus()}
				>
					<div ref={container}>
						<label tw="capitalize font-bold">{label}</label>
						<div tw="relative">
							<NormalInput
								ref={inputRef}
								type="text"
								defaultValue={input}
								tw="block outline-none bg-transparent border-0 pl-1 pr-6 pb-2"
								css={{ borderBottom: "2px solid #20a8d8" }}
								placeholder={intl.formatMessage({ id: "input_placeholder" })}
								onChange={e => {
									onChange && onChange(e)
								}}
								onKeyDown={e => {
									if (e.key === "Enter" || e.key === "Escape") {
										setFocus({ id, fid, focus: false })
										onCancel && input === "" && onCancel()
									}
								}}
							/>
							<CloseButton
								title={intl.formatMessage({ id: "clear" })}
								onClick={e => {
									e.stopPropagation()
									e.preventDefault()
									onChange && onChange("")
									inputRef.current.focus()
								}}
							>
								<FontAwesomeIcon icon={faBackspace} />
							</CloseButton>
						</div>
					</div>
				</motion.div>
			)}
			{!focus && (
				<motion.button
					css={css`
						${tw`transition ease-in-out! duration-200! rounded bg-blue-500 text-white leading-none px-4 py-2`}
						:hover,:focus {
							box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
							${tw`outline-none`}
						}
					`}
					initial={{ scaleY: 0.4 }}
					animate={{ scaleY: 1, transition: { duration: 0.13 } }}
					onMouseDown={() => setFocus({ id, fid, focus: true })}
				>
					<span
						css={css`
							transition: all ease 160ms;
							${tw`pr-2`}
							:hover {
								color: #ee2200;
							}
						`}
						title={intl.formatMessage({ id: "clear" })}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
							onChange && onChange("")
							onCancel && onCancel()
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</span>
					<span tw="capitalize">{label}</span>
					{input && <span>:&quot;{input}&quot;</span>}
				</motion.button>
			)}
		</div>
	)
}
