import type { GymsRepository } from "@/repositories/gyms-repository"
import type { Gym } from "@prisma/client"

interface FetchNearbyGymsProps {
	userLatitude: number
	userLongitude: number
}

interface FetchNearbyGymsResponse {
	gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude
	}: FetchNearbyGymsProps): Promise<FetchNearbyGymsResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			userLatitude,
			userLongitude
		})

		return { gyms }
	}
}
