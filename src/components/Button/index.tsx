import { useRipple } from "./hooks"
import tw, { styled, css } from "twin.macro"

interface Props {
	variant?: "gray" | "blue" | "green" | "yellow" | "red"
}

const Button = styled.button<Props>(({ variant = "gray" }) => {
	return [
		tw`py-3 px-6 rounded text-white leading-none relative overflow-hidden transition ease-in-out! duration-200!`,
		variant === "gray" &&
			css`
				${tw`bg-gray-700 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(160, 174, 192, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(160, 174, 192, 0.5);
					${tw`bg-gray-600`}
				}
			`,
		variant === "blue" &&
			css`
				${tw`bg-blue-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
					${tw`bg-blue-600`}
				}
			`,
		variant === "green" &&
			css`
				${tw`bg-green-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5);
					${tw`bg-green-600`}
				}
			`,
		variant === "yellow" &&
			css`
				${tw`bg-yellow-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.5);
					${tw`bg-yellow-600`}
				}
			`,
		variant === "red" &&
			css`
				${tw`bg-red-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.5);
					${tw`bg-red-600`}
				}
			`,
	]
})

export const RippleButton = ({
	children,
	...props
}: React.PropsWithChildren<Props & Omit<JSX.IntrinsicElements["button"], "ref">>) => {
	const ref = useRipple<HTMLButtonElement>()
	return (
		<Button ref={ref} {...props}>
			{children}
		</Button>
	)
}

export default Button
