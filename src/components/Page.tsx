import { useScollBarVisible } from "./ScrollBar"
import tw, { styled } from "twin.macro"

const PageDetectScrollbar = styled.div<{ hasScrollbar: boolean }>`
	${tw`m-3 p-3 ring-yellow-300`}
	${({ hasScrollbar }) => hasScrollbar && tw`mr-1`}
	background-color: ${({ theme }) => theme.surface};
	color: ${({ theme }) => theme.text.surface};
`

const Page = ({ children }: { children: React.ReactNode }) => {
	const hasScrollbar = useScollBarVisible()
	return <PageDetectScrollbar hasScrollbar={hasScrollbar}>{children}</PageDetectScrollbar>
}

export default Page
