import { UserAlreadyExistsError } from "@/http/errors/user-already-exists-error"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import bcrypt from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { RegisterUserUseCase } from "./register-user"

const usersRepository = new InMemoryUsersRepository()

const EMAIL = "johndoe@test.com"
const NAME = "John Doe"
const PASSWORD = "123456"

describe("Register User Use Case", () => {
    beforeEach(async () => {
        return await usersRepository.resetTestingData()
    })

    it("should be able to register", async () => {
        const sut = new RegisterUserUseCase(usersRepository)

        const { user } = await sut.execute({
            email: EMAIL,
            name: NAME,
            password: PASSWORD
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash user password upon registration", async () => {
        const sut = new RegisterUserUseCase(usersRepository)

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
        const sut = new RegisterUserUseCase(usersRepository)

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
