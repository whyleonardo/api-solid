import { ResourceNotFoundError } from "@/http/errors/resource-not-found-error"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import bcrypt from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { GetUserProfileUseCase } from "./get-user-profile"

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

const EMAIL = "johndoe@test.com"
const PASSWORD = "123456"

describe("Get User Profile Use Case", async () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it("should be able to get user profile", async () => {
		const createdUser = await usersRepository.create({
			name: "John Doe",
			email: EMAIL,
			password_hash: await bcrypt.hash(PASSWORD, 6)
		})

		const { user } = await sut.execute({
			userId: createdUser.id
		})

		expect(user.id).toEqual(expect.any(String))
		expect(user.name).toEqual("John Doe")
	})

	it("shouldn't be able to get user profile with wrong id", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: EMAIL,
			password_hash: await bcrypt.hash(PASSWORD, 6)
		})

		await expect(
			async () =>
				await sut.execute({
					userId: "wrong-id"
				})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
