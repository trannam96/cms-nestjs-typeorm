import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { IResponse } from '../common/interfaces/response.interface';
import { Category } from '../entities/category';
import { CreateCategoryDto } from './dto/create-categ.dto';
import {
  IPaginateQuery,
  IPaginateRes,
} from '../common/interfaces/paginate.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get('/')
  async getAll(@Res() res: any, @Query() query: IPaginateQuery) {
    const response: IResponse<IPaginateRes<Category[] | []>> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.categoryService.index(query);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Get('/:id')
  async getById(
    @Res() res: any,
    @Param('id') id: number,
  ): Promise<IResponse<Category>> {
    const response: IResponse<Category> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.categoryService.getById(id);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Post('/')
  async create(@Res() res: any, @Body() category: CreateCategoryDto) {
    const response: IResponse<Category> = {
      success: true,
      status: HttpStatus.CREATED,
    };
    try {
      response.data = await this.categoryService.create(category);
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
    @Body() category: CreateCategoryDto,
  ) {
    const response: IResponse<Category> = {
      success: true,
      status: HttpStatus.CREATED,
    };
    try {
      response.data = await this.categoryService.update(id, category);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Delete('/:id')
  async delete(@Res() res: any, @Param('id') id: number) {
    const response: IResponse<Category> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.categoryService.delete(id);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
