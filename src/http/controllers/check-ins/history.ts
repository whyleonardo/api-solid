import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1)
	})

	const { page } = checkInHistoryQuerySchema.parse(request.query)

	const useCase = makeFetchUserCheckInsHistoryUseCase()

	const { checkIns } = await useCase.execute({
		page,
		userId: request.user.sub
	})

	return reply.status(200).send({
		checkIns
	})
}
