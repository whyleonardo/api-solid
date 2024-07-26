import "@fastify/jwt"
import type { $Enums } from "@prisma/client"

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			sub: string
			role: $Enums.ROLE
		}
	}
}
