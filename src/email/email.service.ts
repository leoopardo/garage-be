import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: 'no reply <norepy@garage.com>',
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

  async admConfirmAccount(
    to: string,
    subject: string,
    text: string,
    username: string,
  ) {
    try {
      const mailOptions = {
        from: 'no reply <norepy@garage.com>',
        to,
        subject,
        text,
        template: 'confirm',
        context: {
          code: text,
          username,
        },
      };

      return this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.log(`Erro ao enviar o e-mail, ${error}`);
      throw new Error(`Erro ao enviar o e-mail, ${error}`);
    }
  }
}
