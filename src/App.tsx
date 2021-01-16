import type { Store } from "redux"
import { Provider } from "react-redux"
import AppLayout from "~/layout/AppLayout"
import { Global, ThemeProvider } from "@emotion/react"
import tw, { css, GlobalStyles } from "twin.macro"

import { useSelector } from "~/store/hooks"
import { IntlProvider } from "react-intl"
import { getLocaleMessages } from "~/store/i18n/languages"

import FiraCodeFont from "assets/fonts/FiraCode-Regular.woff2"

const globalStyle = css`
	@font-face {
		font-family: Fira Code;
		src: local("Fira Code"), url(${FiraCodeFont}) format("woff2");
	}
	body {
		${tw`leading-normal overflow-hidden`}
		font-family: Roboto, 微軟正黑體, Microsoft JhengHei, Helvetica Neue,
		Helvetica, Arial, PingFang TC, 黑體-繁, Heiti TC, 蘋果儷中黑,
		Apple LiGothic Medium, sans-serif;
	}
	/* ::selection {
		background: rgb(115, 80, 196);
		${tw`text-gray-100`}
	} */
	button:-moz-focusring,
	[type="button"]:-moz-focusring,
	[type="reset"]:-moz-focusring,
	[type="submit"]:-moz-focusring {
		outline: none;
	}

	#modal-root {
		position: absolute;
		bottom: 100%;
		${tw`left-0 right-0 top-0`}
	}

	.ripple-circle {
		position: absolute;
		display: block;
		background: var(--ripple-background, #e0e0e0);
		border-radius: 50%;
		pointer-events: none;

		top: calc(var(--y) * 1px);
		left: calc(var(--x) * 1px);
		width: calc(var(--d) * 1px);
		height: calc(var(--d) * 1px);

		opacity: calc(var(--opacity, 1) * var(--ripple-opacity, 0.3));
		transition: calc(var(--t, 0) * var(--ripple-duration, 1000ms)) var(--ripple-easing, ease-in);
		transform: translate(-50%, -50%) scale(var(--scale, 1));
		transform-origin: center;
	}
`

const StyledThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const theme = useSelector(state => state.theme)
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
	const locale = useSelector(state => state.i18n.locale)
	return (
		<IntlProvider locale={locale} messages={getLocaleMessages(locale)}>
			{children}
		</IntlProvider>
	)
}

export default function App({ store }: { store: Store }) {
	return (
		<Provider store={store}>
			<GlobalStyles />
			<Global styles={globalStyle} />
			<StyledThemeProvider>
				<LanguageProvider>
					<AppLayout />
				</LanguageProvider>
			</StyledThemeProvider>
		</Provider>
	)
}
