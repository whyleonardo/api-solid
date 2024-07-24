import type { GymsRepository } from "@/repositories/gyms-repository"
import type { Gym } from "@prisma/client"

interface SearchGymsUseCaseProps {
	query: string
	page: number
}

interface SearchGymsUseCaseResponse {
	gyms: Gym[]
}

export class SearchGymByNameUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page
	}: SearchGymsUseCaseProps): Promise<SearchGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
