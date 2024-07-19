import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

const usersRepository = new InMemoryUsersRepository();

const EMAIL = "johndoe@test.com";
const PASSWORD = "123456";

describe("Authenticate User Use Case", async () => {
  beforeEach(async () => {
    await usersRepository.create({
      name: "John Doe",
      email: EMAIL,
      password_hash: await bcrypt.hash(PASSWORD, 6),
    });

  });

  it("should be able to authenticate", async () => {
    const sut = new AuthenticateUseCase(usersRepository);

    const { user } = await sut.execute({
      email: EMAIL,
      password: PASSWORD,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("shouldn't be able to authenticate with wrong email", async () => {
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(async () =>
      await sut.execute({
        email: "wrong-email",
        password: PASSWORD,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("shouldn't be able to authenticate with wrong password", async () => {
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(async () =>
      await sut.execute({
        email: EMAIL,
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
