import { css } from "@emotion/react"
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import tw, { styled } from "twin.macro"
import { useAction, useSelector } from "~/store/hooks"
import { supports } from "~/store/i18n/languages"
import { entries } from "~/type-safed"

const Button = styled.button`
	${tw`transition ease-in-out duration-200 opacity-75`}
`

const LanguageSelect = () => {
	const [spread, setSpread] = useState(false)
	const { setLocale } = useAction().i18n
	const button = useRef<HTMLButtonElement>()
	const ul = useRef<HTMLUListElement>()
	const darkmode = useSelector(state => state.theme.name == "dark")

	useEffect(() => {
		const btn = button.current
		const menu = ul.current
		function onMouseDown(e: MouseEvent) {
			if (spread && !menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
				setSpread(false)
			}
		}
		window.addEventListener("mousedown", onMouseDown)
		return () => window.removeEventListener("mousedown", onMouseDown)
	}, [spread])

	return (
		<div tw="relative whitespace-nowrap">
			<Button
				ref={button}
				tw="cursor-pointer select-none rounded-lg px-3 focus:outline-none hover:underline"
				css={[
					css`
						:hover {
							opacity: 1;
							background: ${darkmode ? "#21422c" : "#aae6bf"};
						}
					`,
					{
						backgroundColor: darkmode ? "#183622" : "#c1f7d4",
					},
				]}
				onClick={() => setSpread(true)}
			>
				<FontAwesomeIcon icon={faLanguage} /> <FormattedMessage id="language" />
			</Button>
			<AnimatePresence>
				{spread && (
					<motion.ul
						ref={ul}
						css={[
							tw`absolute right-0 shadow-lg z-10`,
							css`
								top: 1.5rem;
							`,
						]}
						initial={{ opacity: 0, scaleY: 0.2, translateY: -20 }}
						animate={{
							opacity: 1,
							scaleY: 1,
							translateY: 0,
							transition: { easings: "easeIn", duration: 0.1 },
						}}
						exit={{
							opacity: 0,
							scaleY: 0.2,
							translateY: -20,
							transition: { easings: "easeOut", duration: 0.1 },
						}}
					>
						{entries(supports).map(([locale, value]) => (
							<li
								key={locale}
								css={[
									tw`border border-gray-500 px-8 py-2 text-center cursor-pointer whitespace-nowrap select-none`,
									theme => css`
										background: ${theme.secondary};
										color: ${theme.text.secondary};
										:hover {
											background: ${theme.hover.secondary};
											${tw`underline`}
										}
									`,
								]}
								onClick={() => setLocale({ locale })}
							>
								{value}
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	)
}

export default LanguageSelect
