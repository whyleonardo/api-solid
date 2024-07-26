import { app } from "@/app"
import { prisma } from "@/lib/prisma"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Create Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to create a check-in", async () => {
		const { token } = await createAndAuthUser({ app })

		const gym = await prisma.gym.create({
			data: {
				title: "JS Gym",
				latitude: -19.9712504,
				longitude: -44.1933548
			}
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.send({
				title: "JavaScript Gym",
				description: "Some description",
				phone: "1199199999",
				latitude: -19.9712504,
				longitude: -44.1933548
			})
			.set("Authorization", `Bearer ${token}`)

		expect(response.statusCode).toEqual(201)
	})
})
