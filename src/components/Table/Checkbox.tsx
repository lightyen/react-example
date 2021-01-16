import { styled } from "twin.macro"

export const Checkbox = styled.input`
	display: flex;
	appearance: none;
	width: 1rem;
	height: 1rem;
	background-color: #ffffff;
	border-radius: 0.25rem;
	border: 1px solid #cccccc;
	user-select: none;
	outline: none;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	:checked {
		background-color: #4299e1;
		border: 1px solid #72afe0;
		content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff" focusable="false"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>');
	}
	:focus {
		box-shadow: 0 0 2px 3px #7cbff7;
	}
`
