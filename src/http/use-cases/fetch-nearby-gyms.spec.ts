import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

const USER_LATITUDE = -19.9720571
const USER_LONGITUDE = -44.2022313

const FAR_GYM_LATITUDE = -19.9910239
const FAR_GYM_LONGITUDE = -44.4193135

const GYM_LATITUDE = -19.9712504
const GYM_LONGITUDE = -44.1933548

describe("Fetch Nearby Gyms Use Case", async () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it("should be able to fetch only nearby gyms", async () => {
		await gymsRepository.create({
			title: "JS GYM",
			description: "A gym for js devs (closer)",
			phone: "",
			latitude: GYM_LATITUDE,
			longitude: GYM_LONGITUDE
		})

		await gymsRepository.create({
			title: "JS GYM",
			description: "A gym for js devs (far)",
			phone: "",
			latitude: FAR_GYM_LATITUDE,
			longitude: FAR_GYM_LONGITUDE
		})

		const { gyms } = await sut.execute({
			userLatitude: USER_LATITUDE,
			userLongitude: USER_LONGITUDE
		})

		console.log(gyms)

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ description: "A gym for js devs (closer)" })
		])
	})
})
