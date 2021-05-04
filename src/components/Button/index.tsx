import tw, { css, styled } from "twin.macro"
import { useRipple } from "./hooks"

interface Props {
	variant?: "gray" | "blue" | "green" | "yellow" | "red"
}

const Button = styled.button<Props>(({ variant = "gray" }) => {
	return [
		tw`py-3 px-6 rounded text-white leading-none relative overflow-hidden transition`,
		variant === "gray" &&
			css`
				${tw`bg-gray-700 text-white
				hocus:(bg-gray-600 box-shadow[0 0 0 3px rgba(160, 174, 192, 0.5)])
				focus:outline-none`}
			`,
		variant === "blue" &&
			css`
				${tw`bg-blue-500 text-white
				hocus:(bg-blue-400 box-shadow[0 0 0 3px rgba(66, 153, 225, 0.5)])
				focus:outline-none`}
			`,
		variant === "green" &&
			css`
				${tw`bg-green-500 text-white
				hocus:(bg-green-400 box-shadow[0 0 0 3px rgba(72, 187, 120, 0.5)])
				focus:outline-none`}
			`,
		variant === "yellow" &&
			css`
				${tw`
				bg-yellow-500 text-white hocus:(bg-yellow-400 box-shadow[0 0 0 3px rgba(237, 137, 54, 0.5)])
				focus:outline-none
				`}
			`,
		variant === "red" &&
			css`
				${tw`bg-red-500 text-white
				hocus:(bg-red-400 box-shadow[0 0 0 3px rgba(245, 101, 101, 0.5)])
				focus:outline-none
				`}
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
