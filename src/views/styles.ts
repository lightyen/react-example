import tw, { css } from "twin.macro"

export const spinner = css`
	width: 75px;
	height: 75px;
	animation-name: rotate-loading;
	animation-duration: 1.2s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	${tw`relative`}
	::after {
		content: "";
		width: 75px;
		height: 75px;
		animation-name: circle-loading;
		animation-direction: alternate-reverse;
		animation-duration: 1.5s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		${tw`absolute border-blue-600 border-8 rounded-full`}
	}

	@keyframes rotate-loading {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes circle-loading {
		0% {
			clip-path: polygon(0% 0%, 0% 0%, 0% 10%, 50% 50%, 10% 0%, 0% 0%, 0% 0%);
		}
		25% {
			clip-path: polygon(0% 0%, 0% 0%, 0% 50%, 50% 50%, 50% 0%, 0% 0%, 0% 0%);
		}
		50% {
			clip-path: polygon(0% 0%, 0% 100%, 0% 100%, 50% 50%, 100% 0%, 100% 0%, 0% 0%);
		}
		75% {
			clip-path: polygon(0% 0%, 0% 100%, 50% 100%, 50% 50%, 100% 50%, 100% 0%, 0% 0%);
		}
		100% {
			clip-path: polygon(0% 0%, 0% 100%, 90% 100%, 50% 50%, 100% 90%, 100% 0%, 0% 0%);
		}
	}
`
