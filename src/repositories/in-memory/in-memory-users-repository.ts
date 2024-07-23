import type { UsersRepository } from "@/repositories/users-repository"
import type { Prisma, User } from "@prisma/client"

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email)

		if (!user) {
			return null
		}

		return user
	}

	async findById(userId: string) {
		const user = this.items.find((item) => item.id === userId)

		if (!user) {
			return null
		}

		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: "user-test-1",
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		}

		this.items.push(user)
		return user
	}
}
