import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { IMailOptions } from '../../common/interfaces/mail.interfaces';
import { ConfigurationsService } from '../../configurations/configurations.service';
@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(private configService: ConfigurationsService) {
    this.transporter = createTransport({
      host: configService.getEnvironment('MAIL_HOST'),
      port: Number(configService.getEnvironment('MAIL_PORT')),
      secure: false,
      auth: {
        user: configService.getEnvironment('MAIL_USER'),
        pass: configService.getEnvironment('MAIL_PASS'),
      },
    });
  }

  async sendMail(option: IMailOptions) {
    await this.transporter.sendMail(option);
  }
}
