import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"
import { type Gym, Prisma } from "@prisma/client"
import { randomUUID } from "node:crypto"
import type { FindManyNearbyProps, GymsRepository } from "../gyms-repository"

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			created_at: new Date()
		}

		this.items.push(gym)

		return gym
	}

	async findById(gymId: string) {
		const gym = this.items.find((item) => item.id === gymId)

		if (!gym) {
			return null
		}

		return gym
	}

	async searchMany(query: string, page: number) {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20)
	}

	async findManyNearby(data: FindManyNearbyProps) {
		const MAX_DISTANCE_IN_KM = 10

		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: data.userLatitude, longitude: data.userLongitude },
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber()
				}
			)

			return distance < MAX_DISTANCE_IN_KM
		})
	}
}
