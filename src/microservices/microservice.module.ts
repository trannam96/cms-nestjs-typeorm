import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigurationsService } from '../configurations/configurations.service';
import { MailModule } from './mailer/mail.module';
import { MAIL_SERVICE } from '../common/constants';

@Global()
@Module({
  imports: [MailModule],
  providers: [
    {
      provide: MAIL_SERVICE.SERVICE_NAME,
      useFactory: (configService: ConfigurationsService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { port: Number(configService.getEnvironment('MAIL_SERVICE_PORT')) },
        });
      },
      inject: [ConfigurationsService],
    },
  ],
  exports: ['MAIL_SERVICE'],
})
export class MicroserviceModule {}
