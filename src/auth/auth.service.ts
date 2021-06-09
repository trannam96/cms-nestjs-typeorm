import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entities/user';
import { CreateUserDto, UpdateUserDto } from '../user/dto/create-user.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginDto } from '../user/dto/login.dto';
import { JWT_PAYLOAD } from '../common/interfaces/jwt.interface';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SignInRes, VerifyTokenDto } from './dto/sign-res.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigurationsService,
  ) {}

  public generateToken(user: User, options?: JwtSignOptions): string {
    const payload: JWT_PAYLOAD = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, options);
  }

  async register(user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  async login(login: LoginDto): Promise<SignInRes> {
    const user = await this.userService.login(login);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const refreshTokenExpiredIn = this.configService.getRefreshTokenExpiredIn();
    const accessToken = this.generateToken(user);
    const refreshToken = this.generateToken(user, { expiresIn: Number(refreshTokenExpiredIn) });

    await this.userService.update(user.id, { refreshToken: refreshToken } as UpdateUserDto);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async verifyRefreshToken(tokenDto: VerifyTokenDto): Promise<SignInRes> {
    const user = await this.userService.findOne({ refreshToken: tokenDto.refreshToken, isActive: true });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const decode: any = this.jwtService.decode(tokenDto.refreshToken);
    if (!decode?.exp || (decode?.exp && Date.now() >= decode?.exp * 1000)) {
      throw new HttpException('Token expired', HttpStatus.FORBIDDEN);
    }
    const accessToken = this.generateToken(user);
    return {
      accessToken,
    };
  }
}
