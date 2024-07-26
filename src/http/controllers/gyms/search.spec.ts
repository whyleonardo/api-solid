import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Search Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to search for a gym", async () => {
		const { token } = await createAndAuthUser({ app, role: "ADMIN" })

		await request(app.server)
			.post("/gyms")
			.send({
				title: "TS Gym",
				description: "Some description TS",
				phone: "1199199999",
				latitude: -27.2092052,
				longitude: -49.6401091
			})
			.set("Authorization", `Bearer ${token}`)

		await request(app.server)
			.post("/gyms")
			.send({
				title: "JS Gym",
				description: "Some description JS",
				phone: "1199199999",
				latitude: -27.2092052,
				longitude: -49.6401091
			})
			.set("Authorization", `Bearer ${token}`)

		const response = await request(app.server)
			.get("/gyms/search")
			.query({ query: "JS Gym", page: "1" })
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "JS Gym"
			})
		])
	})
})
