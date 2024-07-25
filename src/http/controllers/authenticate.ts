import { InvalidCredentialsError } from "@/http/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export const authenticate = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const registerUserBodySchema = z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(6, { message: "Password must contain at least 6 character(s)" })
	})

	const { email, password } = registerUserBodySchema.parse(request.body)

	try {
		const useCase = makeAuthenticateUseCase()

		const { user } = await useCase.execute({
			email,
			password
		})

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: user.id
				}
			}
		)

		return reply.status(200).send({
			token
		})
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: err.message })
		}

		throw err
	}
}
