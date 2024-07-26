import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Search Nearby Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to search for nearby gyms", async () => {
		const { token } = await createAndAuthUser(app)

		await request(app.server)
			.post("/gyms")
			.send({
				title: "FAR Gym",
				description: "Some description FAR GYM",
				phone: "1199199999",
				latitude: -19.9910239,
				longitude: -44.4193135
			})
			.set("Authorization", `Bearer ${token}`)

		await request(app.server)
			.post("/gyms")
			.send({
				title: "CLOSE Gym",
				description: "Some description CLOSE GYM",
				phone: "1199199999",
				latitude: -19.9712504,
				longitude: -44.1933548
			})
			.set("Authorization", `Bearer ${token}`)

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({ latitude: -19.9720571, longitude: -44.2022313 })
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "CLOSE Gym"
			})
		])
	})
})
