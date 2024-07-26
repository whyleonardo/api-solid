import type { UsersRepository } from "@/repositories/users-repository"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import type { User } from "@prisma/client"
import bcrypt from "bcryptjs"

interface RegisterUserUseCaseProps {
	name: string
	email: string
	password: string
}

interface RegisterUserUseCaseResponse {
	user: User
}

export class RegisterUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		name,
		password
	}: RegisterUserUseCaseProps): Promise<RegisterUserUseCaseResponse> {
		const password_hash = await bcrypt.hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create({
			email,
			password_hash,
			name
		})

		return { user }
	}
}
