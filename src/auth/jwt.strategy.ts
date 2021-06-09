import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationsService } from '../configurations/configurations.service';
import { JWT_PAYLOAD } from '../common/interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigurationsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getEnvironment<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JWT_PAYLOAD) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
