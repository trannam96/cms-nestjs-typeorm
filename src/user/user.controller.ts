import { Body, Controller, HttpStatus, Param, Put, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/create-user.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { UserResDto } from './dto/user-res.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/:id')
  async update(
    @Res() res: any,
    @Body() userDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<IResponse<UserResDto>> {
    const response: IResponse<UserResDto> = {
      status: HttpStatus.OK,
      success: true,
    };
    try {
      response.data = await this.userService.update(id, userDto);
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
