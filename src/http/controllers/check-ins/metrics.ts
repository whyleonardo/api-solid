import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics"
import type { FastifyReply, FastifyRequest } from "fastify"

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
	const useCase = makeGetUserMetricsUseCase()

	const { checkInsCount } = await useCase.execute({
		userId: request.user.sub
	})

	return reply.status(200).send({
		checkInsCount
	})
}
