import { Expose, Type } from 'class-transformer';

class AuthorDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

class Category {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class Tags {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  color: string;
}

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => AuthorDto)
  createdBy: AuthorDto;

  @Expose()
  @Type(() => Category)
  categoryId: Category;

  @Expose()
  @Type(() => Tags)
  tags: Tags[];
}
