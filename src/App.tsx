import { Global, ThemeProvider } from "@emotion/react"
import FiraCodeFont from "assets/fonts/FiraCode-Regular.woff2"
import { createBrowserHistory } from "history"
import { IntlProvider } from "react-intl"
import { Provider as ReactReduxProvider } from "react-redux"
import { Router } from "react-router-dom"
import tw, { css, GlobalStyles } from "twin.macro"
import AppLayout from "~/layout/AppLayout"
import { AppStoreContext, useSelector } from "~/store/hooks"
import { getLocaleMessages } from "~/store/i18n/languages"
import { makeStore } from "~/store/store"

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
		${tw`left-0 right-0 top-0 `}
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

function StoreProvider({ children }: { children?: React.ReactNode }) {
	return (
		<ReactReduxProvider context={AppStoreContext} store={makeStore(createBrowserHistory())}>
			{children}
		</ReactReduxProvider>
	)
}

function HistoryRouter({ children }: React.PropsWithChildren<{}>) {
	const history = useSelector(state => state.history.history)
	return <Router history={history}>{children}</Router>
}

function StyledThemeProvider({ children }: { children?: React.ReactNode }) {
	const theme = useSelector(state => state.theme)
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

function LanguageProvider({ children }: { children?: React.ReactNode }) {
	const locale = useSelector(state => state.i18n.locale)
	return (
		<IntlProvider locale={locale} messages={getLocaleMessages(locale)}>
			{children}
		</IntlProvider>
	)
}

export default function App() {
	return (
		<StoreProvider>
			<GlobalStyles />
			<Global styles={globalStyle} />
			<StyledThemeProvider>
				<LanguageProvider>
					<HistoryRouter>
						<AppLayout />
					</HistoryRouter>
				</LanguageProvider>
			</StyledThemeProvider>
		</StoreProvider>
	)
}
