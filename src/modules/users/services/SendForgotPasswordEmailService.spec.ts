import AppError from "@shared/errors/AppError";

import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeUsersTokenRepository from "@modules/users/repositories/fakes/FakeUsersTokensRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokenRepository
    );
  });

  it("should be able recover the password using the e-mail", async () => {
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({
      email: "johndoe@example.com",
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to recover a non-existing user password", async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: "johndoe@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUsersTokenRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({ email: "johndoe@example.com" });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
