import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Page from "~/components/Page"
import { FormattedMessage } from "react-intl"
import tw, { css } from "twin.macro"

const Box = ({ value, onClick }: { value: number; onClick?: () => void }) => (
	<AnimatePresence>
		<motion.div
			tw="inline-block relative select-none p-3 -mr-3 -mb-3"
			exit={{ opacity: 0, scale: 0, transition: { duration: 0.16 } }}
			layout
		>
			<motion.button
				tw="rounded-lg shadow-lg focus:outline-none"
				css={[
					{
						width: 300,
						height: 80,
					},
					({ background, text }) => css`
						background: ${background};
						color: ${text.background};
						border-width: 1px;
						border-color: ${text.background};
					`,
				]}
				whileTap={{ scale: 0.98, opacity: 0.9 }}
				onClick={onClick}
			>
				#{value}
			</motion.button>
		</motion.div>
	</AnimatePresence>
)

export default function Transition() {
	const [data, setData] = useState([1, 2, 3, 5, 8, 13, 21, 34, 55, 89])
	return (
		<Page>
			<h2 tw="text-3xl mt-8 mb-2 font-black capitalize">
				<FormattedMessage id="nav_transition" />
			</h2>
			<AnimatePresence>
				<motion.div tw="bg-gray-500" css={data.length > 0 && tw`pb-3`} layout>
					{data.map(d => (
						<Box
							key={d}
							value={d}
							onClick={() => {
								const newData = [...data]
								const i = newData.findIndex(a => a === d)
								if (i >= 0) {
									newData.splice(i, 1)
									setData(newData)
								}
							}}
						/>
					))}
				</motion.div>
			</AnimatePresence>
		</Page>
	)
}
