import { env } from "@/env"
import { checkInsRoutes } from "@/http/controllers/check-ins/routes"
import { gymsRoutes } from "@/http/controllers/gyms/routes"
import { usersRoutes } from "@/http/controllers/users/routes"
import fastifyCookie from "@fastify/cookie"
import fastifyJWT from "@fastify/jwt"
import fastify from "fastify"
import { ZodError } from "zod"

export const app = fastify()

app.register(fastifyJWT, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false
	},
	sign: {
		expiresIn: "10m"
	}
})

app.register(fastifyCookie)
app.register(gymsRoutes)
app.register(usersRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation Error", issues: error.format() })
	}

	if (env.NODE_ENV !== "production") {
		console.error(error)
	} else {
		// TODO: Here we should log to an external tool like Datadog/New Relic/Sentry
	}

	return reply.status(500).send({
		message: "Internal Server Error"
	})
})
