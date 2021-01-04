import ISendMailDTO from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";

interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}

export default IMailProvider;
