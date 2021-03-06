import { faBox } from "@fortawesome/free-solid-svg-icons/faBox"
import { faCode } from "@fortawesome/free-solid-svg-icons/faCode"
import { faDiceD6 } from "@fortawesome/free-solid-svg-icons/faDiceD6"
import { faInfinity } from "@fortawesome/free-solid-svg-icons/faInfinity"
import { faThLarge } from "@fortawesome/free-solid-svg-icons/faThLarge"
import { faThList } from "@fortawesome/free-solid-svg-icons/faThList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormattedMessage } from "react-intl"
import { NavLink, NavLinkProps } from "react-router-dom"
import tw, { css, styled } from "twin.macro"
import { useRipple } from "~/components/Button/hooks"
import { useSelector } from "~/store/hooks"

const StyledNavLink = styled(NavLink)`
	transition-property: transform, background-color;
	transition-timing-function: ease;
	transition-duration: 150ms;
	color: ${({ theme }) => theme.text.primary};
	${tw`relative overflow-hidden py-2 px-4 h-12 flex items-center font-medium whitespace-nowrap select-none outline-none`}
	:hover {
		background: ${({ theme }) => theme.hover.primary};
		${tw`underline`}
	}
	&.active {
		transform: translateX(10px);
		background: ${({ theme }) => theme.hover.primary};
	}
	:active {
		background: ${({ theme }) => theme.primaryVariant};
	}
`

const RippleNavLink = (props: NavLinkProps) => {
	const ref = useRipple<HTMLAnchorElement>()
	return <StyledNavLink ref={ref} {...props} />
}

interface Props {
	top: number
	width: number
}

export default function Sidebar({ top, width }: Props) {
	const collapsed = useSelector(state => state.app.collapsed)
	return (
		<nav
			css={[
				tw`fixed overflow-x-hidden transition-all ease-in-out duration-200`,
				theme => css`
					background: ${theme.primary};
					color: ${theme.text.primary};
				`,
				{
					height: `calc(100vh - ${top}px)`,
					top,
					width,
					marginLeft: collapsed ? `${-width}px` : "0px",
				},
			]}
		>
			<ul>
				<RippleNavLink to="/components">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faThLarge} />
					</div>
					<FormattedMessage id="nav_components" />
				</RippleNavLink>
				<RippleNavLink to="/virtual-list">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faInfinity} />
					</div>
					<FormattedMessage id="nav_virtual_list" />
				</RippleNavLink>
				<RippleNavLink to="/table">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faThList} />
					</div>
					<FormattedMessage id="nav_table" />
				</RippleNavLink>
				<RippleNavLink to="/transition">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faDiceD6} />
					</div>
					<FormattedMessage id="nav_transition" />
				</RippleNavLink>
				<RippleNavLink to="/web-component">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faBox} />
					</div>
					<FormattedMessage id="nav_web_component" />
				</RippleNavLink>
				<RippleNavLink to="/codemirror">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faCode} />
					</div>
					<FormattedMessage id="nav_editor" />
				</RippleNavLink>
				<RippleNavLink to="/carousel">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faCode} />
					</div>
					<FormattedMessage id="nav_carousel" />
				</RippleNavLink>
				<RippleNavLink to="/color-picker">
					<div tw="w-8 mr-1 text-center">
						<FontAwesomeIcon icon={faCode} />
					</div>
					<FormattedMessage id="nav_color_picker" />
				</RippleNavLink>
			</ul>
		</nav>
	)
}
