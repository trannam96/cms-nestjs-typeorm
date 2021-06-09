import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '../entities/category';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-categ.dto';
import {
  IPaginateQuery,
  IPaginateRes,
} from '../common/interfaces/paginate.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async index(query: IPaginateQuery): Promise<IPaginateRes<Category[]>> {
    const page = query?.pageIndex || 1;
    const take = query?.pageSize || 10;
    const skip = (page - 1) * take;

    const [categories, count] = await this.categoryRepository.findAndCount({
      take: take,
      skip: skip,
      order: { name: 'DESC' },
    });

    return {
      pageIndex: page,
      pageTotal: Math.ceil(count / take),
      totalItems: count,
      data: categories,
    };
  }

  async getById(id: number): Promise<Category> {
    return await this.categoryRepository.findOneOrFail({ id: id });
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    const newCategory = new Category(category);
    return await this.categoryRepository.save<Category>(newCategory);
  }

  async update(id: number, categoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail({ id: id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const updateCategory = new Category({ ...category, ...categoryDto });
    return await this.categoryRepository.save<Category>(updateCategory);
  }

  async delete(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail({ id: id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return await this.categoryRepository.remove(category);
  }
}
