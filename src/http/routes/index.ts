import type { FastifyInstance } from "fastify";
import { registerUser } from "@/http/controllers/register-user";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", registerUser);
};
