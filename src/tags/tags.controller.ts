import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TagsService } from './tags.service';
import {
  IPaginateQuery,
  IPaginateRes,
} from '../common/interfaces/paginate.interface';
import { IResponse } from '../common/interfaces/response.interface';
import { Tags } from '../entities/tag';
import { CreateTagDto } from './dto/create-tag.dto';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get('/')
  async getAll(@Res() res: any, @Query() query: IPaginateQuery) {
    const response: IResponse<IPaginateRes<Tags[] | []>> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.tagService.index(query);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Get('/:id')
  async getById(@Res() res: any, @Param('id') id: number) {
    const response: IResponse<Tags> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.tagService.getById(id);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Post('/')
  async create(@Res() res: any, @Body() tag: CreateTagDto) {
    const response: IResponse<Tags> = {
      success: true,
      status: HttpStatus.CREATED,
    };
    try {
      response.data = await this.tagService.create(tag);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Put('/:id')
  async update(
    @Res() res: any,
    @Param('id') id: number,
    @Body() tag: CreateTagDto,
  ) {
    const response: IResponse<Tags> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.tagService.update(id, tag);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Delete('/:id')
  async delete(@Res() res: any, @Param('id') id: number) {
    const response: IResponse<Tags> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.tagService.delete(id);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
