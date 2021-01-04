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

    const userToken = await this.usersTokensRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: "[Gobarber] Recuperação de senha",
      templateData: {
        template: "Olá {{name}}. Seu pedido de recuperação de senha: {{token}}",
        variables: {
          name: user.name,
          token: userToken.token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
