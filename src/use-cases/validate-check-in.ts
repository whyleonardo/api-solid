import { LateCheckInValidationError } from "@/http/errors/late-check-in-validation-error"
import { ResourceNotFoundError } from "@/http/errors/resource-not-found-error"
import type { CheckInsRepository } from "@/repositories/check-ins-repository"
import type { CheckIn } from "@prisma/client"
import dayjs from "dayjs"

interface ValidateCheckInUseCaseRequest {
	checkInId: string
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		const MAX_TIME_TO_CHECKIN_IN_MINUTES = 20

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			"minutes"
		)

		if (distanceInMinutesFromCheckInCreation > MAX_TIME_TO_CHECKIN_IN_MINUTES) {
			throw new LateCheckInValidationError()
		}
		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return { checkIn }
	}
}
