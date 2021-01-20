import tw, { styled } from "twin.macro"
import { toRgb } from "~/store/theme/themes"

interface Props {
	invalid?: boolean
	valid?: boolean
}

export default styled.input<Props>`
	${tw`rounded-lg py-2 px-4 block w-full transition ease-in-out! duration-200!`}
	& ~ [aria-label="invalid-message"] {
		${tw`mt-1 text-red-500 text-xs italic`}
	}
	& ~ [aria-label=".valid-message"] {
		${tw`mt-1 text-green-500 text-xs italic`}
	}
	:focus {
		${tw`outline-none ring`}
	}
	background: ${({ theme }) => theme.background};

	${({ invalid, valid, theme }) => {
		if (invalid) {
			return `
			background: rgba(${toRgb(theme.error)}, 0.3);
			focus: {
				background: rgba(${toRgb(theme.error)}, 0.8);
				color: ${theme.text.error};
				box-shadow: 0 0 0 3px rgba(225, 66, 66, 0.507);
			}`
		} else if (valid) {
			return `
			background: rgba(${toRgb(theme.success)}, 0.3);
			focus: {
				background: rgba(${toRgb(theme.success)}, 0.8);
				color: ${theme.text.success};
				box-shadow: 0 0 0 3px rgba(79, 225, 66, 0.507);
			}`
		} else {
			return ""
		}
	}}
`
