import { makeRegisterUserUseCase } from "@/use-cases/factories/make-register-user-use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserAlreadyExistsError } from "../errors/user-already-exists-error"

export const registerUser = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const registerUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z
			.string()
			.min(6, { message: "Password must contain at least 6 character(s)" })
	})

	const { email, name, password } = registerUserBodySchema.parse(request.body)

	try {
		const useCase = makeRegisterUserUseCase()

		await useCase.execute({
			email,
			name,
			password
		})
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
