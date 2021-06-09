import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationsService {
  constructor(private configService: ConfigService) {}

  getEnvironment<T>(key: any): any {
    return this.configService.get<T>(key);
  }

  getRefreshTokenExpiredIn(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED_IN');
  }
}
