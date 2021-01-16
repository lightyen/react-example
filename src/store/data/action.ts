import { createAction } from "@reduxjs/toolkit"

export const fetchGithubIssues = createAction("FETCH_GITHUB_ISSUES")
export const fetchGithubIssuesSuccess = createAction<{ issues: unknown[] }>("FETCH_GITHUB_ISSUES_SUCCESS")

export default {
	fetchGithubIssues,
}
