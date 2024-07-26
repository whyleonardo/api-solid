import type { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"

import { authenticate } from "./authenticate"
import { profile } from "./profile"
import { refresh } from "./refresh"
import { registerUser } from "./register-user"

export async function usersRoutes(app: FastifyInstance) {
	app.post("/users", registerUser)
	app.post("/sessions", authenticate)

	app.patch("/token/refresh", refresh)

	/** Authenticated */
	app.get("/me", { onRequest: [verifyJWT] }, profile)
}
