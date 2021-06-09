import { Expose } from 'class-transformer';

export class UserResDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatarUrl: string;
}
