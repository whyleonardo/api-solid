import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import type { FastifyInstance } from "fastify"
import { create } from "./create"
import { history } from "./history"
import { metrics } from "./metrics"
import { validate } from "./validate"

export const checkInsRoutes = async (app: FastifyInstance) => {
	app.addHook("onRequest", verifyJWT)

	app.post("/gyms/:gymId/check-ins", create)
	app.get("/check-ins/metrics", metrics)
	app.get("/check-ins/history", history)
	app.patch(
		"/check-ins/:checkInId/validate",
		{ onRequest: verifyUserRole("ADMIN") },
		validate
	)
}
