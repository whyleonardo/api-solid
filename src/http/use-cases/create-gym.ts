import type { GymsRepository } from "@/repositories/gyms-repository"
import type { Gym } from "@prisma/client"

interface CreateGymUseCaseProps {
	title: string
	description?: string | null
	phone?: string | null
	latitude: number
	longitude: number
}

interface CreateGymUseCaseResponse {
	gym: Gym
}

export class CreateGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		latitude,
		longitude,
		title,
		description,
		phone
	}: CreateGymUseCaseProps): Promise<CreateGymUseCaseResponse> {
		const gym = await this.gymsRepository.create({
			latitude,
			longitude,
			title,
			phone,
			description
		})

		return { gym }
	}
}
