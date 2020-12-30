import IEmailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";

interface IMessage {
  to: string;
  body: string;
}

class FakeMailProvider implements IEmailProvider {
  private message: IMessage[] = [];
  public async sendMail(to: string, body: string): Promise<void> {
    this.message.push({ to, body });
  }
}

export default FakeMailProvider;
