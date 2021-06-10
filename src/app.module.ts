import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './microservices/mailer/mail.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceModule } from './microservices/microservice.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    ConfigurationsModule,
    CategoriesModule,
    TagsModule,
    PostsModule,
    UploadModule,
    MicroserviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
