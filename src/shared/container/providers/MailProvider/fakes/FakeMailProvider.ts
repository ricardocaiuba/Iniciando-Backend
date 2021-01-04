import IEmailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import ISendEmailDTO from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";

class FakeMailProvider implements IEmailProvider {
  private message: ISendEmailDTO[] = [];

  public async sendMail(data: ISendEmailDTO): Promise<void> {
    this.message.push(data);
  }
}

export default FakeMailProvider;
