import chroma from "chroma-js"
import tailwind from "~/tailwind.config"

const colors = tailwind.theme.colors

export const themes = {
	light: {
		name: "light",
		primary: colors.blue[300],
		primaryVariant: colors.blue[400],
		secondary: colors.green[300],
		secondaryVariant: colors.green[400],
		background: colors.gray[200],
		surface: colors.gray[100],
		error: colors.red[500],
		success: colors.green[500],
		text: {
			primary: colors.gray[800],
			secondary: colors.gray[800],
			background: colors.gray[900],
			surface: colors.gray[900],
			error: colors.gray[900],
			success: colors.gray[900],
		},
		hover: {
			primary: colors.blue[500],
			secondary: colors.green[400],
			background: colors.gray[500],
			surface: colors.gray[500],
			error: colors.red[200],
			success: colors.green[200],
		},
	},
	dark: {
		name: "dark",
		primary: colors.blue[900],
		primaryVariant: colors.blue[800],
		secondary: colors.green[900],
		secondaryVariant: colors.green[800],
		background: colors.gray[900],
		surface: "#232933",
		error: colors.red[500],
		success: colors.green[500],
		text: {
			primary: colors.gray[100],
			secondary: colors.gray[100],
			background: colors.gray[100],
			surface: colors.gray[100],
			error: colors.gray[100],
			success: colors.gray[100],
		},
		hover: {
			primary: colors.blue[700],
			secondary: colors.green[700],
			background: colors.gray[500],
			surface: colors.gray[500],
			error: colors.red[800],
			success: colors.green[800],
		},
	},
}

export type ThemeMode = keyof typeof themes

export type Theme = typeof themes["light"]

// You will need to change gtk3 theme and restart the browser if you are on linux.
const darkmodeQuery = window.matchMedia("(prefers-color-scheme: dark)")

function getTheme(): ThemeMode {
	const theme = localStorage.getItem("theme")
	if (theme == "dark") {
		return "dark"
	}
	if (theme == "light") {
		return "light"
	}
	// auto
	const darkmode = darkmodeQuery.matches
	if (darkmode) {
		return "dark"
	}
	return "light"
}

function setTheme(obj: Theme, prefix = "--theme") {
	const root = document.documentElement
	for (const key in obj) {
		if (typeof obj[key] === "string") {
			try {
				const color = chroma(obj[key])
				root.style.setProperty(prefix + "-" + key.toLowerCase(), color.rgb().join(","))
			} catch (e: unknown) {}
		} else {
			setTheme(obj[key], prefix + "-" + key.toLowerCase())
		}
	}
}

export function prepareTheme(name = "", cached = false) {
	const theme = themes[name || getTheme()]
	setTheme(theme)
	document.body.style.backgroundColor = theme.background
	document.body.style.color = theme.text.background
	document.body.style.borderColor = theme.background
	const root = document.documentElement
	const bg = chroma(theme.background)
	const darkmode = bg.luminance() < 0.3
	const cover = darkmode ? bg.brighten(1).alpha(0.5) : bg.darken(3).alpha(0.5)
	root.style.setProperty("--theme-modal-cover-bg", cover.rgba().join(","))
	root.style.setProperty("--theme-modal-shadow", chroma(theme.background).alpha(0.2).rgba().join(","))
	root.style.setProperty("--theme-shadow", chroma(theme.text.background).alpha(0.2).rgba().join(","))
	root.style.setProperty("--theme-shadow-ambient", chroma(theme.text.background).alpha(0.05).rgba().join(","))

	root.style.setProperty(
		"--theme--color-picker-background",
		darkmode ? bg.brighten(0.5).rgb().join(",") : bg.darken(0.5).rgb().join(","),
	)
	cached && localStorage.setItem("theme", name)
	return { ...theme, name: darkmode ? "dark" : "light" }
}
