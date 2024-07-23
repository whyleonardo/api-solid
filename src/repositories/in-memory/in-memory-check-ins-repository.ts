import type { CheckIn, Prisma } from "@prisma/client"
import dayjs from "dayjs"
import type { CheckInsRepository } from "../check-ins-repository"

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = []

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: crypto.randomUUID(),
			gym_id: data.gym_id,
			user_id: data.user_id,
			validated_at: data.validated_at ? new Date() : null,
			created_at: new Date()
		}

		this.items.push(checkIn)

		return checkIn
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date")
		const endOfTheDay = dayjs(date).endOf("date")

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnSameDate
		})

		if (!checkInOnSameDate) {
			return null
		}

		return checkInOnSameDate
	}
}
