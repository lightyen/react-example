import { forwardRef, useRef } from "react"
import { v4 } from "uuid"
import tw, { styled } from "twin.macro"

const Check = styled.input`
	display: none;
`

const Slider = styled.label`
	width: 3.7rem;
	height: 1.8rem;
	border-radius: 9999px;
	${tw`transition ease-in-out! duration-200! bg-gray-400`}

	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.4rem;
	cursor: pointer;
	user-select: none;
	color: #555;
	${Check}:checked + & {
		${tw`bg-blue-500`}
	}

	&::after {
		content: "";
		${tw`transition ease-in-out! duration-200!`}
		width: 1.3rem;
		height: 1.3rem;
		top: 0.25rem;
		left: 0.16rem;
		transform: translateX(0.14rem);
		cursor: pointer;
		position: absolute;
		border-radius: 9999px;
		background: #eee;
		border: solid 1px #597a64;
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

export default forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
	const uuid = useRef(v4())
	return (
		<div tw="inline-block relative">
			<Check ref={ref} id={uuid.current} type="checkbox" {...props} />
			<Slider htmlFor={uuid.current} />
		</div>
	)
})
