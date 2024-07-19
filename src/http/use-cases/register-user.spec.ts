import { UserAlreadyExistsError } from "@/http/errors/user-already-exists-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { RegisterUserUseCase } from "./register-user";

describe("Register User Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(usersRepository);

    const { user } = await registerUserUseCase.execute({
      email: "johndoe@test.com",
      password: "123456",
      name: "John Doe",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(usersRepository);

    const { user } = await registerUserUseCase.execute({
      email: "email@doe.com",
      name: "John Doe",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shouldn't be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(usersRepository);

    const email = "johndoe@test.com";

    await registerUserUseCase.execute({
      email,
      name: "John Doe",
      password: "123456",
    });

    await expect(async () => {
      await registerUserUseCase.execute({
        email,
        name: "John Doe",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
