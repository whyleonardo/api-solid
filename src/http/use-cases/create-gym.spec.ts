import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { CreateGymUseCase } from "./create-gym"

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

const GYM_INFO = {
	title: "JS GYM",
	description: "A gym for js devs",
	latitude: -19.9397152,
	longitude: -44.1670932,
	created_at: new Date()
}

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it("should be able to create a gym", async () => {
		const { gym } = await sut.execute({ ...GYM_INFO })

		expect(gym.id).toEqual(expect.any(String))
	})
})
