import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: 'leo.san9@hotmail.com',
        to,
        subject,
        text,
        template: 'index',
        context: {
          code: text,
        },
      };

      return this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.log(`Erro ao enviar o e-mail, ${error}`);
      throw new Error(`Erro ao enviar o e-mail, ${error}`);
    }
  }
}
