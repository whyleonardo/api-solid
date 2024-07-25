import type { Environment } from "vitest"

export default (<Environment>{
	name: "Prisma",
	transformMode: "ssr",
	async setup() {
		console.log("Setup")

		return {
			teardown() {
				console.log("Teardown")
			}
		}
	}
})
