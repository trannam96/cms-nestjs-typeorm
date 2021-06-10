import { Body, Controller, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { User } from '../entities/user';
import { LoginDto } from '../user/dto/login.dto';
import { SignInRes, VerifyTokenDto } from './dto/sign-res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Res() res: any, @Body() user: CreateUserDto): Promise<IResponse<any>> {
    const response: IResponse<User> = {
      success: true,
      status: HttpStatus.CREATED,
    };
    try {
      response.data = await this.authService.register(user);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Post('/sign-in')
  async login(@Res() res, @Body() login: LoginDto): Promise<IResponse<SignInRes>> {
    const response: IResponse<SignInRes> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.authService.login(login);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }

  @Post('/refresh-token')
  async verifyRefreshToken(@Res() res: any, @Body() refreshToken: VerifyTokenDto) {
    const response: IResponse<any> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      response.data = await this.authService.verifyRefreshToken(refreshToken);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
