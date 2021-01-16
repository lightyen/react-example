import { useSelector, useAction, useI18n } from "~/store/hooks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import DarkModeToggle from "~/components/DarkModeToggle"
import LanguageSelect from "~/components/LanguageSelect"
import tw, { css } from "twin.macro"

interface Props {
	height: number
}

export default function Header({ height }: Props) {
	const { setSidebarVisible } = useAction().app
	const visible = useSelector(state => state.app.sidebarVisible)
	const { enable } = useI18n()
	return (
		<header
			css={[
				tw`flex items-center`,
				css`
					background: rgb(var(--theme-secondary));
					color: rgb(var(--theme-text-secondary));
				`,
				{ height },
			]}
		>
			<Link tw="px-3 capitalize outline-none hover:underline" to="/">
				<FontAwesomeIcon icon={faHome} />
			</Link>
			<motion.button
				tw="px-3 focus:outline-none select-none"
				initial={{ opacity: visible ? 1 : 0.5 }}
				animate={{ opacity: visible ? 1 : 0.5 }}
				onClick={() => setSidebarVisible({ visible: !visible })}
			>
				<FontAwesomeIcon icon={faBars} />
			</motion.button>
			<div tw="flex-grow flex justify-end px-3">
				<div tw="mr-3">
					<DarkModeToggle />
				</div>
				{enable && <LanguageSelect />}
			</div>
		</header>
	)
}
