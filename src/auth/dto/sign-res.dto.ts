import { IsOptional } from 'class-validator';

export class SignInRes {
  accessToken: string;

  @IsOptional()
  refreshToken?: string;
}

export class VerifyTokenDto {
  refreshToken: string;
}
