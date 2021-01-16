import ColorPicker from "~/components/ColorPicker"
import Page from "~/components/Page"
import { FormattedMessage } from "react-intl"
import "twin.macro"

const ColorPickerPage = () => {
	return (
		<Page>
			<h2 tw="text-3xl mt-8 mb-2 font-black capitalize">
				<FormattedMessage id="nav_color_picker" />
			</h2>
			<ColorPicker />
		</Page>
	)
}

export default ColorPickerPage
