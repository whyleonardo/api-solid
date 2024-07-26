import type { UsersRepository } from "@/repositories/users-repository"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"
import type { User } from "@prisma/client"
import bcrypt from "bcryptjs"

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

interface AuthenticateUseCaseResponse {
	user: User
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatches = await bcrypt.compare(
			password,
			user.password_hash
		)

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return { user }
	}
}
