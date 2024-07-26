import { app } from "@/app"
import { prisma } from "@/lib/prisma"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Validate Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("should be able to valdiate check-in", async () => {
		const { token } = await createAndAuthUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: "JS Gym",
				latitude: -19.9712504,
				longitude: -44.1933548
			}
		})

		let checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id
			}
		})

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(204)

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id
			}
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})
})
