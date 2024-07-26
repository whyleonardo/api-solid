import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Create Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to create a gym", async () => {
		const { token } = await createAndAuthUser({ app, role: "ADMIN" })

		const response = await request(app.server)
			.post("/gyms")
			.send({
				title: "JavaScript Gym",
				description: "Some description",
				phone: "1199199999",
				latitude: -27.2092052,
				longitude: -49.6401091
			})
			.set("Authorization", `Bearer ${token}`)

		expect(response.statusCode).toEqual(201)
	})
})
