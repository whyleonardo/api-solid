import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
	const searchGymsQuerySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1)
	})

	const { query, page } = searchGymsQuerySchema.parse(request.query)

	const useCase = makeSearchGymsUseCase()

	const { gyms } = await useCase.execute({
		query,
		page
	})

	return reply.status(200).send({
		gyms
	})
}
