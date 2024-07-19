import { InvalidCredentialsError } from "@/http/errors/invalid-credentials-error";
import { AuthenticateUseCase } from "@/http/use-cases/authenticate";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const registerUserBodySchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 character(s)" }),
  });

  const { email, password } = registerUserBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
};
