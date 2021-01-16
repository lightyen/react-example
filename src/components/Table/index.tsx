import { useState } from "react"
import { useTable, BaseColumnProps, WithCheckbox } from "./hooks"
import { FormattedMessage } from "react-intl"
import { TheadCell } from "./TheadCell"
import { AddFilter } from "./AddFilter"
import { FilterPattern } from "./FilterPattern"
import { FilterSelect } from "./FilterSelect"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInbox } from "@fortawesome/free-solid-svg-icons/faInbox"
import { Pagination } from "./Pagination"
import { ViewOption, ViewCount } from "./ViewCount"
import { Checkbox } from "./Checkbox"
export * from "./common"

import { Provider } from "react-redux"
import { store, Context, useFiltersAction, useFiltersSelector, register } from "./store"
export { register }
import "twin.macro"
import type { Interpolation, Theme } from "@emotion/react"
import tw, { css, styled } from "twin.macro"

const TD = styled.td`
	transition: all ease 0.16s;
	${tw`text-gray-900 bg-white whitespace-nowrap box-border px-3 py-2 border`}
`

const CheckboxTH = styled(TD)`
	${tw`py-3`}
`

export interface Column<T> extends BaseColumnProps<T> {
	title?: string
	css?: Interpolation<Theme>
	attributes?: (record: T, row: number) => { [key: string]: unknown }
	render: (record: T, row: number) => React.ReactNode
}

type ShowTotalCallback = (total: number, begin: number, end: number) => React.ReactNode

interface PaginationOptions {
	/** 每頁顯示的資料筆數 */
	pageSize?: number | number[]
	paginationTop?: boolean
	infiniteLoop?: boolean
	maxPageItem?: number
	showTotal?: ShowTotalCallback
}

interface TableProps<T> extends PaginationOptions {
	/** Cache store 的識別 ID */
	id: string
	/** 資料來源 */
	data: T[]
	/** 欄位描述 */
	columns: Array<Column<T>>
	rowKey?: (record: T, index: number) => React.Key
	onRowClick?: (e: React.MouseEvent, record: T) => void
	/** Set each item with "**\_\_checkbox\_\_**" field will enable this feature. */
	onChecked?(result: Array<WithCheckbox<T>>): void
}

interface FilterComponentsProps<T> {
	id: string
	columns: Array<Column<T>>
	setFilterInput: (fid: string, inputValue: unknown) => void
}

function FilterComponents<T>({ id, columns, setFilterInput }: FilterComponentsProps<T>) {
	const { setFilters, setFocus } = useFiltersAction()
	const filters = useFiltersSelector(state => state[id].filters)

	const filerOpts = columns
		.map((col, i) => {
			const ret: typeof col.filters = []
			for (let k = 0; k < col.filters?.length; k++) {
				const f = col.filters[k]
				const fid = `${i}-${k}`
				if (f && filters.findIndex(o => o.fid === fid) === -1) {
					ret.push({ ...f, fid })
				}
			}
			return ret
		})
		.flat()
		.map(f => ({
			label: f.label,
			value: f.fid,
			filter: f,
		}))

	return (
		<div tw="flex flex-wrap z-10 sm:h-12">
			{filters.map((f, i) =>
				f.type === "pattern" ? (
					<FilterPattern
						tabIndex={i}
						key={f.fid}
						fid={f.fid}
						id={id}
						label={f.label}
						onChange={keyword => setFilterInput(f.fid, keyword)}
						onCancel={() => {
							setFilters({
								id,
								filters: filters.filter(v => v.fid !== f.fid),
							})
						}}
					/>
				) : (
					<FilterSelect
						tabIndex={i}
						key={f.fid}
						fid={f.fid}
						id={id}
						label={f.label}
						options={f.filterOptions}
						styles={f.styles}
						isMulti={f.isMulti}
						onChange={keyword => setFilterInput(f.fid, keyword)}
						onCancel={() => {
							setFilters({
								id,
								filters: filters.filter(v => v.fid !== f.fid),
							})
						}}
					/>
				),
			)}
			<AddFilter
				tabIndex={filters.length}
				options={filerOpts}
				onChange={fid => {
					const f = filerOpts.find(o => o.value === fid).filter
					setFilters({ id, filters: [...filters, f] })
					setFocus({ id, fid: f.fid, focus: true })
				}}
			/>
		</div>
	)
}

function TableLayout<T>({
	id = "",
	data = [],
	columns = [],
	rowKey = (_, i) => i.toString(),
	onRowClick,
	pageSize,
	paginationTop = false,
	maxPageItem = 5,
	infiniteLoop = false,
	showTotal,

	onChecked,
}: TableProps<T>) {
	const [_pageSize, _setPageSize] = useState(() => {
		if (pageSize instanceof Array) {
			return pageSize.length > 0 ? pageSize[0] : 10
		}
		return pageSize
	})

	const pageCountOpts: ViewOption[] =
		pageSize instanceof Array && pageSize.length > 0 ? pageSize.map(p => ({ label: p.toFixed(0), value: p })) : []

	const {
		rows,
		// sort
		sortTypes,
		nextSortType,
		// filter
		setFilterInput,
		// checkbox
		enableCheckbox,
		allChecked,
		setAllChecked,
		setChecked,
		// pagination
		page,
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
	} = useTable<T>({
		id,
		data,
		columns,

		pageSize: _pageSize,
		maxPageItem,
		infiniteLoop,
	})

	const view = _pageSize ? page : rows

	const pagination = {
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
	}

	return (
		<div>
			<div tw="flex justify-between">
				<FilterComponents id={id} columns={columns} setFilterInput={setFilterInput} />
				{pageCountOpts.length > 0 && (
					<div tw="mb-4 sm:h-12">
						<ViewCount
							options={pageCountOpts}
							count={_pageSize}
							onChange={value => {
								_setPageSize(value)
								gotoPage(0)
							}}
							container={{ width: 108 }}
						/>
					</div>
				)}
			</div>
			{paginationTop && _pageSize != undefined && <Pagination {...pagination} />}
			<div tw="w-full overflow-x-auto">
				<table
					tw="border-collapse table-auto leading-normal"
					css={css`
						width: calc(100% - 1px);
					`}
				>
					<thead tw="font-bold text-left text-gray-800">
						<tr>
							{enableCheckbox && (
								<CheckboxTH>
									<div tw="flex items-stretch">
										<Checkbox
											checked={allChecked}
											onChange={e => {
												const result = setAllChecked(e.target.checked)
												onChecked && onChecked(result)
											}}
										/>
									</div>
								</CheckboxTH>
							)}
							{columns.map((column, col) => (
								<TheadCell
									key={col}
									css={column.css}
									sortType={sortTypes[col]}
									onClick={() => nextSortType(col)}
								>
									{column.title}
								</TheadCell>
							))}
						</tr>
					</thead>
					<tbody
						css={css`
							tr:nth-of-type(odd) > td {
								${tw`bg-gray-300`}
							}
							tr:hover > td {
								${tw`bg-blue-300`}
							}
						`}
					>
						{view.map((record, row) => (
							<tr key={rowKey(record, row)} onDoubleClick={e => onRowClick && onRowClick(e, record)}>
								{enableCheckbox && (
									<TD>
										<div tw="flex items-center">
											<Checkbox
												checked={(record as WithCheckbox<T>).__checkbox__}
												onChange={e => {
													const result = setChecked(
														record as WithCheckbox<T>,
														e.target.checked,
													)
													onChecked && onChecked(result)
												}}
											/>
										</div>
									</TD>
								)}
								{columns.map((column, col) => (
									<TD
										css={column.css}
										key={`${rowKey(record, row)}&${col}`}
										{...(!!column.attributes && column.attributes(record, row))}
									>
										{column.render(record, row)}
									</TD>
								))}
							</tr>
						))}
						{view.length === 0 && (
							<tr>
								<TD colSpan={columns.length + (enableCheckbox ? 1 : 0)}>
									<div tw="flex justify-center items-center text-gray-500">
										<FontAwesomeIcon icon={faInbox} size="2x" />
										<span tw="p-4">
											<FormattedMessage id="data_empty" />
										</span>
									</div>
								</TD>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div tw="pt-3 md:flex md:justify-between">
				{_pageSize != undefined && <Pagination {...pagination} />}
				{showTotal && _pageSize != undefined && (
					<div tw="mb-3 md:mb-0">
						{showTotal(
							rows.length,
							rows.length ? pageIndex * _pageSize + 1 : 0,
							pageIndex * _pageSize + view.length,
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export function Table<T>(props: TableProps<T>) {
	const table = store.getState()[props.id]
	if (!table) {
		console.error(`"${props.id}" is not found: ID must be setup in redux.`)
		return null
	}
	return (
		<Provider store={store} context={Context}>
			<TableLayout {...props} />
		</Provider>
	)
}
