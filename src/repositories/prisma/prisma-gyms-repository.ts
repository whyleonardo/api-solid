import { prisma } from "@/lib/prisma"
import type { Gym, Prisma } from "@prisma/client"
import type { FindManyNearbyProps, GymsRepository } from "../gyms-repository"

export class PrismaGymsRepository implements GymsRepository {
	async findById(gymId: string) {
		const gym = await prisma.gym.findUnique({
			where: {
				id: gymId
			}
		})

		return gym
	}

	async searchMany(query: string, page: number) {
		const gyms = await prisma.gym.findMany({
			where: {
				title: {
					contains: query
				}
			},
			take: 20,
			skip: (page - 1) * 20
		})

		return gyms
	}

	async findManyNearby({ userLatitude, userLongitude }: FindManyNearbyProps) {
		const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * FROM gyms
    WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

		return gyms
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = await prisma.gym.create({
			data
		})

		return gym
	}
}
