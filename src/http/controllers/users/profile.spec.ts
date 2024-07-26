import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Profile (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to get user profile", async () => {
		const { token } = await createAndAuthUser({ app })

		const profileResponse = await request(app.server)
			.get("/me")
			.send()
			.set("Authorization", `Bearer ${token}`)

		expect(profileResponse.statusCode).toEqual(200)
		expect(profileResponse.body).toEqual(
			expect.objectContaining({
				email: "johndoe@example.com"
			})
		)
	})
})
