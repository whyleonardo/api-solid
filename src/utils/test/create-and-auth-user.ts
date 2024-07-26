import { prisma } from "@/lib/prisma"
import type { $Enums } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { FastifyInstance } from "fastify"
import request from "supertest"

interface CreateAndAuthUserProps {
	app: FastifyInstance
	role?: $Enums.ROLE
}

export async function createAndAuthUser({
	app,
	role = "MEMBER"
}: CreateAndAuthUserProps) {
	await prisma.user.create({
		data: {
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await bcrypt.hash("123456", 6),
			role
		}
	})

	const authResponse = await request(app.server).post("/sessions").send({
		email: "johndoe@example.com",
		password: "123456"
	})

	const { token } = authResponse.body

	return { token }
}
