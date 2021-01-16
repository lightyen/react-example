import { useScollBarVisible } from "./ScrollBar"
import tw, { styled } from "twin.macro"

const PageDetectScrollbar = styled.div<{ hasScrollbar: boolean }>`
	${tw`m-3 p-3`}
	${({ hasScrollbar }) => hasScrollbar && tw`mr-1`}
	background-color: rgb(var(--theme-surface));
	color: rgb(var(--theme-text-surface));
`

const Page = ({ children }: { children: React.ReactNode }) => {
	const hasScrollbar = useScollBarVisible()
	return <PageDetectScrollbar hasScrollbar={hasScrollbar}>{children}</PageDetectScrollbar>
}

export default Page
