import { prisma } from "@/lib/prisma";
import type { UsersRepository } from "@/repositories/users-repository";
import type { Prisma } from "@prisma/client";

export class PrismaUsersRepository implements UsersRepository {
  async create({ password_hash, name, email }: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        password_hash,
        email,
        name,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: { email: true },
    });

    return user;
  }
}
