import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"
import bcrypt from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { AuthenticateUseCase } from "./authenticate"

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

const EMAIL = "johndoe@test.com"
const PASSWORD = "123456"

describe("Authenticate User Use Case", async () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it("should be able to authenticate", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: EMAIL,
			password_hash: await bcrypt.hash(PASSWORD, 6)
		})

		const { user } = await sut.execute({
			email: EMAIL,
			password: PASSWORD
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it("shouldn't be able to authenticate with wrong email", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: EMAIL,
			password_hash: await bcrypt.hash(PASSWORD, 6)
		})

		await expect(
			async () =>
				await sut.execute({
					email: "wrong-email",
					password: PASSWORD
				})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it("shouldn't be able to authenticate with wrong password", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: EMAIL,
			password_hash: await bcrypt.hash(PASSWORD, 6)
		})

		await expect(
			async () =>
				await sut.execute({
					email: EMAIL,
					password: "wrong-password"
				})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
