import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import tw, { css } from "twin.macro"
import DarkModeToggle from "~/components/DarkModeToggle"
import LanguageSelect from "~/components/LanguageSelect"
import { useAction, useSelector } from "~/store/hooks"

interface Props {
	height: number
}

export default function Header({ height }: Props) {
	const { setSidebarVisible } = useAction().app
	const visible = useSelector(state => state.app.sidebarVisible)
	const enable = useSelector(state => state.i18n.enable)
	return (
		<header
			css={[
				tw`flex items-center`,
				theme => css`
					background: ${theme.secondary};
					color: ${theme.text.secondary};
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
			<div tw="flex-grow flex justify-end px-3 opacity-0">
				<div tw="mr-3">
					<DarkModeToggle />
				</div>
				{enable && <LanguageSelect />}
			</div>
		</header>
	)
}
