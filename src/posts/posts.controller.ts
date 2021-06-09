import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { IResponse } from '../common/interfaces/response.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPolicies, PoliciesGuard } from '../auth/guards/police.guard';
import { AppAbility } from '../auth/casl-ability.factory';
import { Action } from '../common/enum';
import { PostEntity } from '../entities/post';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../entities/user';
import { PostDto } from './dto/pots-res.dto';
import { PostQueryDto } from './dto/post-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/')
  async getAllPost(@Res() res: any, @Query() query: PostQueryDto) {
    const response: IResponse<any> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.postService.getAllPost(query);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Res() res: any, @Body() postDto: CreatePostDto, @CurrentUser() user: User) {
    const response: IResponse<PostDto> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.postService.create(user, postDto);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, PostEntity))
  async update(@Res() res: any, @Body() post: CreatePostDto, @Param('id') id: number) {
    const response: IResponse<PostDto> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.postService.update(id, post);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, PostEntity))
  async delete(@Res() res: any, @Param('id') id: number) {
    const response: IResponse<boolean> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.postService.delete(id);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
