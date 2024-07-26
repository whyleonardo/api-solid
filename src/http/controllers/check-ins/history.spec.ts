import { app } from "@/app"
import { prisma } from "@/lib/prisma"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Fetch Check-ins History (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to list user check-ins history", async () => {
		const { token } = await createAndAuthUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: "JS Gym",
				latitude: -19.9712504,
				longitude: -44.1933548
			}
		})

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id
				},
				{
					gym_id: gym.id,
					user_id: user.id
				}
			]
		})

		const response = await request(app.server)
			.get("/check-ins/history")
			.send()
			.set("Authorization", `Bearer ${token}`)

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({ gym_id: gym.id, user_id: user.id }),
			expect.objectContaining({ gym_id: gym.id, user_id: user.id })
		])
	})
})
