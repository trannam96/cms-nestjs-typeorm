import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { IMailOptions } from '../../common/interfaces/mail.interfaces';
import { MAIL_SERVICE } from '../../common/constants';

@Controller('mails')
export class MailController {
  private readonly logger = new Logger(MailController.name);
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(MAIL_SERVICE.CMD.SEND_MAIL)
  async sendMailEvent(data: IMailOptions): Promise<void> {
    try {
      await this.mailService.sendMail(data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
