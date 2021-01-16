/// <reference types="@emotion/react/types/css-prop" />

import "@emotion/react"
import { ThemeStore } from "~/store/theme/reducer"

declare module "@emotion/react" {
	export interface Theme extends ThemeStore {}
}
