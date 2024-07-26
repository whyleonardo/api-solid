import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		})
	})

	const { description, latitude, longitude, phone, title } =
		createGymBodySchema.parse(request.body)

	const useCase = makeCreateGymUseCase()

	await useCase.execute({
		description,
		latitude,
		longitude,
		phone,
		title
	})

	return reply.status(201).send()
}
