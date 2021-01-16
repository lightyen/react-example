import { keyframes } from "@emotion/react"
import tw, { styled } from "twin.macro"
import type { Theme } from "~/store/theme/themes"
const shimmer = keyframes`
 100% {
    transform: translateX(100%);
  }
`

export const skeleton = (component: React.ComponentType) => styled(component)<{ theme?: Theme }>`
	position: relative;
	overflow: hidden;
	--base-color: ${({ theme }) => (theme.name === "dark" ? `33, 33, 33` : `255, 255, 255`)};
	&:after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(
			90deg,
			rgba(var(--base-color), 0) 0,
			rgba(var(--base-color), 0.3) 30%,
			rgba(var(--base-color), 0.5) 50%,
			rgba(var(--base-color), 0.3) 80%,
			rgba(var(--base-color), 0)
		);
		animation: ${shimmer} 2.2s infinite;
		content: "";
	}
`

const Wrapper = styled.div`
	${tw`rounded min-h-8 inline-flex items-center justify-center w-full px-4 py-2`}
	${({ theme }) => (theme.name === "dark" ? tw`bg-gray-800 text-gray-300` : tw`bg-gray-300 text-gray-600`)}
`

const SkeletonBox = skeleton(props => <Wrapper {...props} />)

export default function Skeleton({
	children,
	pending = true,
	content,
	...props
}: React.PropsWithChildren<{ pending?: boolean; content?: React.ReactNode }>) {
	return pending ? <SkeletonBox {...props}>{content}</SkeletonBox> : <>{children}</>
}
