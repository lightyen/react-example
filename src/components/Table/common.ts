export const withTextRegexp = (text: string) => {
	const pattern = /([\w.-]+( *\| *[\w.-]+)*)/g
	const result = []
	const arr = text.match(pattern)
	if (arr?.length) {
		for (const v of arr) {
			result.push(`(?=.*${v.replace(" ", "").replace(/[-/\\^$*+?.()[\]{}]/g, "\\$&")})`)
		}
		return new RegExp(result.join(""), "i")
	}
	return new RegExp(`${text.replace(/[-/\\^$*+?.()[\]{}]/g, "\\$&")}`, "i")
}
