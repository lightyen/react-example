/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { FormattedMessage } from "react-intl"
import Modal from "~/components/Modal"
import { startOfDay, endOfDay, subDays } from "date-fns"
import { CustomDateRangePicker, DateRange } from "~/components/DateRangePicker"
import PromptModal from "~/components/PromptModal"
import { RippleButton } from "~/components/Button"
import Page from "~/components/Page"
import tw, { css } from "twin.macro"
import { FormGroup, Label, Field, InputText, ErrorMessage } from "~/components/Form"
import { useForm } from "react-hook-form"
import Skeleton from "~/components/Skeleton"
import Spinner from "~/components/Spinner"

function useDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
	const handle = useRef<number>()
	return useCallback(
		(...args: Parameters<T>) => {
			window.clearTimeout(handle.current)
			handle.current = window.setTimeout(cb, delay, args)
		},
		[cb, delay],
	)
}

function debounceValidate<T extends (...args: any[]) => any>(cb: T, delay: number): (...args: any[]) => Promise<any> {
	let h: number
	return (...args: any[]) =>
		new Promise<any>(resolve => {
			window.clearTimeout(h)
			h = window.setTimeout(() => resolve(cb(...args)), delay)
		})
}

interface Data {
	test: string
}

const SectionHeader = tw.h3`text-xl mt-6 mb-3 font-bold capitalize`

const ModalButton = () => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<RippleButton variant="blue" tw="mr-3" onClick={e => setOpen(true)}>
				<FormattedMessage id="modal" />
			</RippleButton>
			<Modal tw="w-1/2" open={open} onMouseDownOutside={e => setOpen(false)}>
				<div tw="px-6 my-3">
					<div tw="mt-4 mb-2">
						<div tw="font-bold text-xl mb-2 capitalize">
							<FormattedMessage id="title" />
						</div>
					</div>
					<div tw="h-12 mb-3">bla bla bla...</div>
					<div tw="mb-3 flex justify-end">
						<RippleButton
							variant="blue"
							onClick={e => {
								e.preventDefault()
								e.stopPropagation()
								setOpen(false)
							}}
						>
							<FormattedMessage id="ok" />
						</RippleButton>
					</div>
				</div>
			</Modal>
		</>
	)
}

const ModalButton2 = () => {
	const [open2, setOpen2] = useState(false)
	return (
		<>
			<RippleButton onClick={e => setOpen2(true)}>
				<FormattedMessage id="modal" />
			</RippleButton>
			<Modal tw="w-1/2" open={open2} exitAnime={false} onMouseDownOutside={e => setOpen2(false)}>
				<div tw="px-6 my-3">
					<div tw="mt-4 mb-2">
						<div tw="font-bold text-xl mb-2 capitalize">
							<FormattedMessage id="title" />
						</div>
					</div>
					<div tw="h-12 mb-3">ha ha ha...</div>
					<div tw="mb-3 flex justify-end">
						<RippleButton
							variant="green"
							tw="flex items-center"
							onClick={e => {
								e.preventDefault()
								e.stopPropagation()
								setOpen2(false)
							}}
						>
							<svg
								id="i-checkmark"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								width="16"
								height="16"
								fill="none"
								stroke="currentcolor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="4"
							>
								<path d="M2 20 L12 28 30 4" />
							</svg>
							<span tw="pl-2">
								<FormattedMessage id="ok" />
							</span>
						</RippleButton>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default function ComponentsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(() => {
		const now = new Date()
		return { startDate: startOfDay(subDays(now, 2)), endDate: endOfDay(now) }
	})
	const { register, handleSubmit, errors } = useForm<Data>()
	const [value, setValue] = useState("")
	const debounceChange = useDebounce(e => setValue(e), 500)

	return (
		<Page>
			<PromptModal when={false} />
			<h2 tw="text-3xl mt-8 mb-5 font-black capitalize">
				<FormattedMessage id="nav_components" />
			</h2>
			<SectionHeader>
				<FormattedMessage id="button" />
			</SectionHeader>
			<div tw="-mb-2 flex flex-wrap">
				<RippleButton tw="inline-flex mr-2 mb-2">
					<Spinner tw="mr-3" />
					<FormattedMessage id="button" />
				</RippleButton>
				<RippleButton variant="blue" tw="inline-flex mr-2 mb-2">
					<FormattedMessage id="button" />
				</RippleButton>
				<RippleButton variant="green" tw="inline-flex mr-2 mb-2">
					<FormattedMessage id="button" />
				</RippleButton>
				<RippleButton variant="red" tw="inline-flex mr-2 mb-2">
					<FormattedMessage id="button" />
				</RippleButton>
				<RippleButton variant="yellow" tw="inline-flex mr-2 mb-2">
					<FontAwesomeIcon tw="mr-2" icon={faBars} />
					<FormattedMessage id="button" />
				</RippleButton>
			</div>
			<SectionHeader>Skeleton</SectionHeader>
			<Skeleton pending={true}>
				<div>Test</div>
			</Skeleton>
			<SectionHeader>
				<FormattedMessage id="date_range_picker" />
			</SectionHeader>
			<div tw="mb-6">
				<CustomDateRangePicker
					tw="font-normal capitalize py-2 px-3 rounded"
					css={css`
						${tw`bg-blue-500 text-white transition ease-in-out! duration-200!`}
						:focus {
							box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
							${tw`outline-none`}
						}
						:hover {
							box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
							${tw`bg-blue-600`}
						}
					`}
					range={dateRange}
					onChange={e => setDateRange(e)}
				/>
			</div>
			<SectionHeader>
				<FormattedMessage id="card" />
			</SectionHeader>
			<div
				tw="max-w-sm mb-6 rounded overflow-hidden"
				css={css`
					box-shadow: 2px 2px 12px -1px rgba(var(--theme-shadow)),
						0px 0px 6px 0px rgba(var(--theme-shadow-ambient));
				`}
			>
				<div
					tw="w-auto h-48"
					css={({ primary }) => css`
						background: ${primary};
					`}
				/>
				<div tw="px-6 py-4">
					<div tw="font-bold text-xl mb-2">The Coldest Sunset</div>
					<p tw="text-base">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
						perferendis eaque, exercitationem praesentium nihil.
					</p>
				</div>
			</div>
			<SectionHeader>
				<FormattedMessage id="form" />
			</SectionHeader>
			<form
				tw="mb-6 p-6 border border-gray-500"
				onSubmit={handleSubmit(data => {
					console.log(data)
				})}
			>
				<FormGroup>
					<Label>Name</Label>
					<Field>
						<InputText
							name="test"
							placeholder="placeholder"
							spellCheck="false"
							invalid={!!errors.test}
							ref={register({
								required: { value: true, message: "Value is required." },
								// validate: debounceValidate(data => {
								// 	if (!data) {
								// 		return "Value is required."
								// 	}
								// 	return null
								// }, 500),
							})}
						/>
						{errors.test?.type === "required" && (
							<ErrorMessage>
								<FormattedMessage id="invalid_required" />
							</ErrorMessage>
						)}
					</Field>
				</FormGroup>
				<RippleButton type="submit" variant="blue" tw="w-full md:w-auto">
					<FormattedMessage id="submit" />
				</RippleButton>
			</form>
			<SectionHeader>
				<FormattedMessage id="modal" />
			</SectionHeader>
			<div tw="mb-6">
				<ModalButton />
				<ModalButton2 />
			</div>
		</Page>
	)
}
