import { MaxDistanceError } from "@/http/errors/max-distance-error"
import { MaxNumberOfCheckInsError } from "@/http/errors/max-number-of-check-ins-error"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import type { Gym } from "@prisma/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CheckInUseCase } from "./check-in"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const FAR_USER_LATITUDE = -19.9700516
const FAR_USER_LONGITUDE = -44.1893008

let gym: Gym

describe("Check-in Use Case", async () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gym = await gymsRepository.create({
			title: "JS GYM",
			description: "A gym for js devs",
			phone: "",
			latitude: -19.9397152,
			longitude: -44.1670932
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to make a new check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: gym.id,
			userId: "user-id-0",
			userLatitude: -19.9397152,
			userLongitude: -44.1670932
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("shouldn't be able to make check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: gym.id,
			userId: "user-id-0",
			userLatitude: -19.9397152,
			userLongitude: -44.1670932
		})

		vi.setSystemTime(new Date(2023, 0, 20, 19, 0, 0))

		await expect(
			async () =>
				await sut.execute({
					gymId: gym.id,
					userId: "user-id-0",
					userLatitude: -19.9397152,
					userLongitude: -44.1670932
				})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it("should be able to make check-in twice but in different days", async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: gym.id,
			userId: "user-id-0",
			userLatitude: -19.9397152,
			userLongitude: -44.1670932
		})

		vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: gym.id,
			userId: "user-id-0",
			userLatitude: -19.9397152,
			userLongitude: -44.1670932
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("shouldn't be able to make a check-in on distant gym", async () => {
		await expect(
			async () =>
				await sut.execute({
					gymId: gym.id,
					userId: "user-id-0",
					userLatitude: FAR_USER_LATITUDE,
					userLongitude: FAR_USER_LONGITUDE
				})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
