import { Controller, HttpException, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IResponse } from '../common/interfaces/response.interface';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@Res() res: any, @UploadedFiles() files: Array<Express.Multer.File>) {
    const response: IResponse<any> = {
      success: true,
      status: HttpStatus.OK,
    };
    try {
      if (!files.length) throw new HttpException('Files is not empty', HttpStatus.UNPROCESSABLE_ENTITY);
      if (files.length === 1) {
        response.data = await this.uploadService.uploadFile(files[0].buffer);
      } else {
        response.data = await Promise.all(
          files.map(async (file) => {
            return await this.uploadService.uploadFile(file.buffer);
          }),
        );
      }
    } catch (error) {
      response.success = false;
      response.error = { message: error?.message };
      response.status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(response.status).json(response);
  }
}
