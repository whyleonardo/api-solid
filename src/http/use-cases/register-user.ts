import { UserAlreadyExistsError } from "@/http/errors/user-already-exists-error";
import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";
import crypto from "bcryptjs";

interface RegisterUserUseCaseProps {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserUseCaseProps): Promise<RegisterUseCaseResponse> {
    const password_hash = await crypto.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email,
      password_hash,
      name,
    });

    return { user };
  }
}
