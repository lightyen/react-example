module.exports = {
	darkMode: "media",
	theme: {
		extend: {
			minHeight: {
				8: "2rem",
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ["group-focus"],
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		function ({ addUtilities, addComponents, e, prefix, config }) {
			// Add your custom styles here
			addUtilities({
				".test-10": {
					color: "#100",
				},
				".test-50": {
					color: "#400",
				},
			})
		},
	],
}
