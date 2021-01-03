import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IUsersTokensRepository from "@modules/users/repositories/IUsersTokensRepository";

// import User from "../infra/typeorm/entities/User";

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    await this.usersTokensRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      "Pedido de recuperação de senha recebido"
    );
  }
}

export default SendForgotPasswordEmailService;