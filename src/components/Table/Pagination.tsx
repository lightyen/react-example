import tw, { styled } from "twin.macro"
interface PaginationProps {
	pageIndex: number
	links: number[]
	pageCount: number
	gotoPage: (index: number) => void
	previousPage: () => void
	nextPage: () => void
	hasMoreNextPage: boolean
	hasMorePrevPage: boolean
	disableNext: boolean
	disablePrevious: boolean
}

const PageLink = styled.button<{ active?: boolean; disabled?: boolean }>`
	${tw`w-full select-none rounded-none cursor-pointer py-1 px-3 text-blue-500`}
	:hover {
		${tw`bg-blue-300 text-gray-100`}
	}
	:focus {
		${tw`outline-none`}
	}
	${({ active }) => active && tw`bg-blue-500 text-gray-100`}
	${({ disabled }) => disabled && tw`text-gray-500 bg-gray-100 cursor-not-allowed`}
`

const PageLinkItem = styled.li`
	min-width: 33px;
	${tw`flex overflow-hidden`}
	:first-of-type {
		${tw`rounded-l`}
	}
	:last-of-type {
		${tw`rounded-r`}
	}
`

interface PageItemProps {
	active?: boolean
	disabled?: boolean
	onClick?(): void
	children: React.ReactNode
}

const PageItem = ({ children, ...props }: PageItemProps) => {
	return (
		<PageLinkItem>
			<PageLink {...props}>{children}</PageLink>
		</PageLinkItem>
	)
}

export const Pagination = ({
	pageIndex,
	links,
	pageCount,
	gotoPage,
	previousPage,
	nextPage,
	hasMoreNextPage,
	hasMorePrevPage,
	disableNext,
	disablePrevious,
}: PaginationProps) => {
	return (
		<ul tw="flex mb-3 md:mb-0">
			<PageItem disabled={disablePrevious} onClick={() => gotoPage(0)}>
				&laquo;
			</PageItem>
			<PageItem disabled={disablePrevious} onClick={() => previousPage()}>
				&lsaquo;
			</PageItem>
			{hasMorePrevPage && (
				<PageItem onClick={() => gotoPage(links[0] - 1)}>
					<span>...</span>
				</PageItem>
			)}
			{links.map(v => (
				<PageItem key={v} active={v === pageIndex} onClick={() => gotoPage(v)}>
					{v + 1}
				</PageItem>
			))}
			{hasMoreNextPage && (
				<PageItem onClick={() => gotoPage(links[links.length - 1] + 1)}>
					<span>...</span>
				</PageItem>
			)}
			<PageItem disabled={disableNext} onClick={() => nextPage()}>
				&rsaquo;
			</PageItem>
			<PageItem disabled={disableNext} onClick={() => gotoPage(pageCount - 1)}>
				&raquo;
			</PageItem>
		</ul>
	)
}
