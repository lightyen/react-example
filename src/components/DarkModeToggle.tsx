import { useRef } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun"
import { faMoon } from "@fortawesome/free-solid-svg-icons/faMoon"
import { useAction, useSelector } from "~/store/hooks"
import { v4 as uuidv4 } from "uuid"

import tw, { styled } from "twin.macro"

const Check = styled.input`
	display: none;
`

const Slider = styled.label`
	width: 3.6rem;
	height: 1.5rem;
	border-radius: 9999px;
	${tw`transition ease-in-out! duration-200!`}

	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.4rem;
	cursor: pointer;
	user-select: none;

	background: #c1f7d4;
	color: #555;
	${Check}:checked + & {
		background: #183622;
		color: #f2ec0c;
	}

	&::after {
		content: "";
		${tw`transition ease-in-out! duration-200!`}
		width: 1.2rem;
		height: 1.2rem;
		top: 0.15rem;
		left: 0.16rem;
		transform: translateX(0.14rem);
		cursor: pointer;
		position: absolute;
		border-radius: 9999px;
		background: #eee;
		border: solid 1px #869c8d;
	}

	&:hover::after {
		box-shadow: 0 0 1px 2px rgba(66, 153, 225, 0.5);
	}

	&:hover {
		color: #333;
	}

	${Check}:checked + &::after {
		transform: translateX(2rem);
		background: #eee;
	}
`

const DarkModeToggle = () => {
	const name = useSelector(state => state.theme.name)
	const { changeTheme } = useAction().theme
	const uuid = useRef(uuidv4())

	const bk = useSelector(state => state.app.breakpoint)
	const hide = bk == "xs" || bk == "sm"
	if (hide) {
		return null
	}

	return (
		<div css={tw`relative`}>
			<Check
				id={uuid.current}
				type="checkbox"
				defaultChecked={name == "dark"}
				onChange={e => changeTheme({ name: e.target.checked ? "dark" : "light", cached: false })}
			/>
			<Slider htmlFor={uuid.current}>
				<FontAwesomeIcon icon={faMoon} />
				<FontAwesomeIcon icon={faSun} />
			</Slider>
		</div>
	)
}

export default DarkModeToggle
