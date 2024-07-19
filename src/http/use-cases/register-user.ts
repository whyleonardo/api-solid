import { UserAlreadyExistsError } from "@/http/errors/user-already-exists-error";
import type { UsersRepository } from "@/repositories/users-repository";
import crypto from "bcryptjs";

interface RegisterUserUseCaseProps {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUserUseCaseProps) {
    const password_hash = await crypto.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({ email, password_hash, name });
  }
}
