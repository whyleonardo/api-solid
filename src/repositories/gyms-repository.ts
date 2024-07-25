import type { Gym, Prisma } from "@prisma/client"

export interface FindManyNearbyProps {
	userLatitude: number
	userLongitude: number
}

export interface GymsRepository {
	findById: (gymId: string) => Promise<Gym | null>
	searchMany: (query: string, page: number) => Promise<Gym[]>
	create: (data: Prisma.GymCreateInput) => Promise<Gym>
	findManyNearby: (data: FindManyNearbyProps) => Promise<Gym[]>
}
