import "dayjs/locale/zh-tw"
import { FormattedMessage } from "react-intl"
import "twin.macro"
import ReactLogo from "~/assets/logo.svg"
import Page from "~/components/Page"

export default function Home() {
	return (
		<Page>
			<ReactLogo
				tw="h-10 transition-colors bg-gray-700 hover:( ring ring-gray-600)
		bg-opacity-60
			  hover:background-color[rgba(87, 84, 88, var(--tw-bg-opacity))]
			"
			/>
			<FormattedMessage id="test" values={{ name: "React" }} />
		</Page>
	)
}
