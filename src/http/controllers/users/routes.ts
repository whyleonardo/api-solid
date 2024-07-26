import type { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"

import { profile } from "@/http/controllers/users/profile"
import { registerUser } from "@/http/controllers/users/register-user"
import { authenticate } from "./authenticate"

export async function usersRoutes(app: FastifyInstance) {
	app.post("/users", registerUser)
	app.post("/sessions", authenticate)

	// app.patch("/token/refresh", refresh)

	/** Authenticated */
	app.get("/me", { onRequest: [verifyJWT] }, profile)
}
