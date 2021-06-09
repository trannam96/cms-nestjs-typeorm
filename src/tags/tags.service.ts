import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '../entities/tag';
import { Repository } from 'typeorm';
import {
  IPaginateQuery,
  IPaginateRes,
} from '../common/interfaces/paginate.interface';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags) private tagsRepository: Repository<Tags>,
  ) {}

  async index(query: IPaginateQuery): Promise<IPaginateRes<Tags[]>> {
    const page = query?.pageIndex || 1;
    const take = query?.pageSize || 10;
    const skip = (page - 1) * take;

    const [tags, count] = await this.tagsRepository.findAndCount({
      take: take,
      skip: skip,
      order: { name: 'DESC' },
    });

    return {
      pageIndex: page,
      pageTotal: Math.ceil(count / take),
      totalItems: count,
      data: tags,
    };
  }

  async getById(id: number): Promise<Tags> {
    return await this.tagsRepository.findOneOrFail({ id: id });
  }

  async create(tag: CreateTagDto): Promise<Tags> {
    const newTag = new Tags(tag);
    return await this.tagsRepository.save<Tags>(newTag);
  }

  async update(id: number, tagDto: CreateTagDto): Promise<Tags> {
    const tag = await this.tagsRepository.findOneOrFail({ id: id });
    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
    const updateTag = new Tags({ ...tag, ...tagDto });
    return await this.tagsRepository.save<Tags>(updateTag);
  }

  async delete(id: number): Promise<Tags> {
    const tag = await this.tagsRepository.findOneOrFail({ id: id });
    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
    return await this.tagsRepository.remove(tag);
  }
}
