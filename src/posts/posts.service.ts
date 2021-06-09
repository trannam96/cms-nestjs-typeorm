import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { IPaginateRes } from '../common/interfaces/paginate.interface';
import { PostRepository } from '../repositories/post.repository';
import { Category } from '../entities/category';
import { In, Repository } from 'typeorm';
import { Tags } from '../entities/tag';
import { PostDto } from './dto/pots-res.dto';
import { plainToClass } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { JWT_PAYLOAD } from '../common/interfaces/jwt.interface';
import { PostQueryDto } from './dto/post-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getAllPost(query: PostQueryDto): Promise<IPaginateRes<PostDto[]>> {
    const page = +query?.pageIndex || 1;
    const take = +query?.pageSize || 10;
    const skip = (page - 1) * take;

    const whereQuery: any = { isPublished: true, isActive: true };

    if (query.createdBy) {
      whereQuery.createdBy = In(query.createdBy.split(',').map(Number));
    }

    if (query.categoryId) {
      whereQuery.categoryId = In(query.categoryId.split(',').map(Number));
    }

    const [posts, count] = await this.postRepository.findAndCount({
      relations: ['tags', 'categoryId', 'createdBy'],
      where: whereQuery,
      take: take,
      skip: skip,
      order: { updatedAt: 'DESC' },
    });

    const postRes = posts.map((post) => plainToClass(PostDto, post, { excludeExtraneousValues: true }));

    return {
      pageIndex: page,
      pageTotal: Math.ceil(count / take),
      totalItems: count,
      data: postRes,
    };
  }

  async create(user: JWT_PAYLOAD, postDto: CreatePostDto): Promise<PostDto> {
    const newPost = this.postRepository.create();
    const category = await this.categoryRepository.findOne({
      id: postDto.categoryId,
    });

    const currentUser = await this.userRepository.findOne(user.id);

    if (!currentUser) throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY);

    if (!category) throw new HttpException('Category not found', HttpStatus.UNPROCESSABLE_ENTITY);

    if (postDto.tags && !!postDto.tags.length) {
      const tags = await this.tagsRepository.findByIds(postDto.tags);
      if (!tags.length) throw new HttpException('Tags not found', HttpStatus.UNPROCESSABLE_ENTITY);
      newPost.tags = tags;
    }

    newPost.title = postDto.title;
    newPost.content = postDto.content;
    newPost.isPublished = postDto.isPublished;
    newPost.createdBy = currentUser;
    newPost.categoryId = category;

    const post = await this.postRepository.save(newPost);

    return plainToClass(PostDto, post, { excludeExtraneousValues: true });
  }

  async update(id: number, postDto: CreatePostDto): Promise<PostDto> {
    const post = await this.postRepository.findOne(id);

    if (!post) throw new HttpException('Post not found', HttpStatus.UNPROCESSABLE_ENTITY);

    const category = await this.categoryRepository.findOne({
      id: postDto.categoryId,
    });

    if (!category) throw new HttpException('Category not found', HttpStatus.UNPROCESSABLE_ENTITY);

    if (postDto.tags && !!postDto.tags.length) {
      const tags = await this.tagsRepository.findByIds(postDto.tags);
      if (!tags.length) throw new HttpException('Tags not found', HttpStatus.UNPROCESSABLE_ENTITY);
      post.tags = tags;
    }

    if (postDto.tags && postDto.tags.length === 0) {
      post.tags = [];
    }
    post.categoryId = category;
    post.title = postDto.title;
    post.content = postDto.content;
    post.isPublished = postDto.isPublished;

    const updatePost = await this.postRepository.save(post);

    return plainToClass(PostDto, updatePost, { excludeExtraneousValues: true });
  }

  async delete(id: number): Promise<boolean> {
    const post = await this.postRepository.findOne(id);
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    await this.postRepository.remove(post);
    return true;
  }
}
