import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime/library"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CheckInUseCase } from "./check-in"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const USER_LATITUDE = -19.9700516
const USER_LONGITUDE = -44.1893008

describe("Check-in Use Case", async () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymsRepository.items.push({
			id: "gym-id-01",
			title: "JS Gym",
			created_at: new Date(),
			description: "",
			phone: "",
			latitude: new Decimal(USER_LATITUDE),
			longitude: new Decimal(USER_LONGITUDE)
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to make a new check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-id-01",
			userId: "user-id-0",
			userLatitude: USER_LATITUDE,
			userLongitude: USER_LONGITUDE
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("shouldn't be able to make check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-id-01",
			userId: "user-id-0",
			userLatitude: USER_LATITUDE,
			userLongitude: USER_LONGITUDE
		})

		vi.setSystemTime(new Date(2023, 0, 20, 19, 0, 0))

		await expect(
			async () =>
				await sut.execute({
					gymId: "gym-id-01",
					userId: "user-id-0",
					userLatitude: USER_LATITUDE,
					userLongitude: USER_LONGITUDE
				})
		).rejects.toBeInstanceOf(Error)
	})

	it("should be able to make check-in twice but in different days", async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-id-01",
			userId: "user-id-0",
			userLatitude: USER_LATITUDE,
			userLongitude: USER_LONGITUDE
		})

		vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: "gym-id-01",
			userId: "user-id-0",
			userLatitude: USER_LATITUDE,
			userLongitude: USER_LONGITUDE
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("shouldn't be able to make a check-in on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-id-02",
			title: "JS Gym 02",
			created_at: new Date(),
			description: "",
			phone: "",
			latitude: new Decimal(-19.9397152),
			longitude: new Decimal(-44.1670932)
		})

		await expect(
			async () =>
				await sut.execute({
					gymId: "gym-id-02",
					userId: "user-id-0",
					userLatitude: USER_LATITUDE,
					userLongitude: USER_LONGITUDE
				})
		).rejects.toBeInstanceOf(Error)
	})
})
