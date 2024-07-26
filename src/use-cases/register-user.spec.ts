import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import bcrypt from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { RegisterUserUseCase } from "./register-user"

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

const EMAIL = "johndoe@test.com"
const NAME = "John Doe"
const PASSWORD = "123456"

describe("Register User Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUserUseCase(usersRepository)
	})

	it("should be able to register", async () => {
		const { user } = await sut.execute({
			email: EMAIL,
			name: NAME,
			password: PASSWORD
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it("should hash user password upon registration", async () => {
		const { user } = await sut.execute({
			email: EMAIL,
			name: NAME,
			password: PASSWORD
		})

		const isPasswordCorrectlyHashed = await bcrypt.compare(
			PASSWORD,
			user.password_hash
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it("shouldn't be able to register with same email twice", async () => {
		await sut.execute({
			email: EMAIL,
			name: NAME,
			password: PASSWORD
		})

		await expect(async () => {
			await sut.execute({
				email: EMAIL,
				name: NAME,
				password: PASSWORD
			})
		}).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
