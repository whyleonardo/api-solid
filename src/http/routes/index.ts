import { authenticate } from "@/http/controllers/authenticate"
import { profile } from "@/http/controllers/profile"
import { registerUser } from "@/http/controllers/register-user"
import type { FastifyInstance } from "fastify"

export const appRoutes = async (app: FastifyInstance) => {
	app.post("/users", registerUser)
	app.post("/sessions", authenticate)

	// Authenticated Only
	app.get("/me", profile)
}
