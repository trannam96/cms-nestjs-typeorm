import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from '../repositories/post.repository';
import { Category } from '../entities/category';
import { Tags } from '../entities/tag';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, Category, Tags, UserRepository])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
