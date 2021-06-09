import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { UserController } from './user.controller';

@Module({
  imports: [UserModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserHttpModule {}
