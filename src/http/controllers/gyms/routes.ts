import { verifyJWT } from "@/http/middlewares/verify-jwt"
import type { FastifyInstance } from "fastify"
import { create } from "./create"
import { nearby } from "./nearby"
import { search } from "./search"

export const gymsRoutes = async (app: FastifyInstance) => {
	app.addHook("onRequest", verifyJWT)

	app.get("/gyms/search", search)
	app.get("/gyms/nearby", nearby)
	app.post("/gyms", create)
}
