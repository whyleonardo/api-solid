import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { LateCheckInValidationError } from "@/use-cases/errors/late-check-in-validation-error"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ValidateCheckInUseCase } from "./validate-check-in"

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("Validate Check-in Use Case", async () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to validate the check-in", async () => {
		const createdCheckIn = await checkInsRepository.create({
			user_id: "user-id-01",
			gym_id: "gym-id-01"
		})

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it("shouldn't be able to validate an inexistent check-in", async () => {
		await expect(
			async () =>
				await sut.execute({
					checkInId: "inexistent-check-in"
				})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it("shouldn't be able to validate the check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2024, 0, 1, 13, 0))

		const createdCheckIn = await checkInsRepository.create({
			user_id: "user-id-01",
			gym_id: "gym-id-01"
		})

		const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21

		vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

		await expect(
			async () =>
				await sut.execute({
					checkInId: createdCheckIn.id
				})
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})
