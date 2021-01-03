import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeUsersTokenRepository from "@modules/users/repositories/fakes/FakeUsersTokensRepository";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe("ResetPasswordService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokenRepository,
      fakeHashProvider
    );
  });

  it("should to be able to reset password", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { token } = await fakeUsersTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPassword.execute({
      token,
      password: "123123",
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("123123");
    expect(updatedUser?.password).toBe("123123");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPassword.execute({
        token: "non-existing-token",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing user", async () => {
    const { token } = await fakeUsersTokenRepository.generate(
      "non-existing-user"
    );

    await expect(
      resetPassword.execute({
        token,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password if passes more than 2 hours", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { token } = await fakeUsersTokenRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
