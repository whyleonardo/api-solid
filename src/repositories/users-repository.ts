import type { Prisma } from "@prisma/client";

export interface UsersRepository {
  create: (data: Prisma.UserCreateInput) => Promise<Prisma.UserCreateInput>;
  findByEmail: (email: string) => Promise<{ email: string } | null>;
}
