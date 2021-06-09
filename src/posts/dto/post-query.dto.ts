import { IsOptional } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  pageIndex: number;

  @IsOptional()
  pageSize: number;

  @IsOptional()
  categoryId: string;

  @IsOptional()
  tags: string;

  @IsOptional()
  createdBy: string;
}
