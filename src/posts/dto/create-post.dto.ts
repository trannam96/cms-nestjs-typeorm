import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  tags: number[];

  @IsOptional()
  isPublished: boolean;
}
