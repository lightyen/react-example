import tw, { styled } from "twin.macro"

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
	background: rgb(var(--theme-background));
	:focus {
		${tw`outline-none ring`}
	}
	${({ invalid }) => invalid && "background: rgba(var(--theme-error), 0.3);"}
	:focus {
		${({ invalid }) => invalid && "background: rgba(var(--theme-error), 0.8);"}
		${({ invalid }) => invalid && "color: rgba(var(--theme-text-error));"}
		${({ invalid }) => invalid && `box-shadow: 0 0 0 3px rgba(225, 66, 66, 0.507);`}
	}

	${({ valid }) => valid && "background: rgba(var(--theme-success), 0.3);"}
	:focus {
		${({ valid }) => valid && "color: rgba(var(--theme-text-success));"}
		${({ valid }) => valid && `box-shadow: 0 0 0 3px rgba(79, 225, 66, 0.507);`}
	}
`
