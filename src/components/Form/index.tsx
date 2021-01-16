import tw, { styled } from "twin.macro"

export const FormGroup = tw.div`md:flex mb-6`

export const Label = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div tw="md:w-1/3">
			<label tw="mb-3 md:mb-0 block font-bold md:text-left pr-4">{children}</label>
		</div>
	)
}

export const Field = tw.div`md:w-2/3`

import type { Theme } from "~/store/theme/themes"

export const InputText = styled.input<{ invalid?: boolean; theme?: Theme }>`
	${tw`w-full rounded shadow appearance-none py-2 px-4 leading-tight transition duration-200! focus:outline-none`}
	background: rgb(var(--theme-background));
	${({ invalid }) => invalid && tw`border border-red-500`}
	:disabled {
		${tw`bg-gray-200 cursor-not-allowed`}
	}
	:focus {
		${tw`ring`}
		${props => props.theme.name === "dark" && tw`bg-gray-800`}
		${props => props.theme.name === "light" && tw`bg-white`}
		${({ invalid }) => invalid && `box-shadow: 0 0 0 2px rgba(245, 101, 101, 0.5);`}
	}
`

export const InputSelect = styled.select`
	${tw`block w-full shadow appearance-none py-2 pl-3 pr-10 leading-tight bg-gray-100 text-gray-900 border border-gray-500 focus:bg-white focus:outline-none focus:ring`}
	:disabled {
		${tw`bg-gray-200 cursor-not-allowed`}
	}
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3e%3cpath d='M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z'/%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 0.5rem center;
	background-size: 1.5em 1.5em;
`

export const ErrorMessage = tw.p`text-red-500`
