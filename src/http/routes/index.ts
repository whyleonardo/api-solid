import { authenticate } from "@/http/controllers/authenticate";
import { registerUser } from "@/http/controllers/register-user";
import type { FastifyInstance } from "fastify";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", registerUser);
  app.post("/sessions", authenticate);
};
