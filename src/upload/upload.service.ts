import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Cloudinary from 'cloudinary';
import { ConfigurationsService } from '../configurations/configurations.service';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigurationsService) {
    Cloudinary.v2.config({
      cloud_name: configService.getEnvironment<string>('CLOUNDINARY_CLOUND_NAME'),
      api_key: configService.getEnvironment<string>('CLOUNDINARY_API_KEY'),
      api_secret: configService.getEnvironment<string>('CLOUNDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Buffer) {
    return new Promise((resolve) => {
      Cloudinary.v2.uploader
        .upload_stream(
          {
            folder: this.configService.getEnvironment<string>('CLOUNDINARY_FOLDER'),
          },
          (error, result) => {
            if (error) {
              throw error;
            } else {
              const { url, secure_url } = result;
              resolve({ url, secure_url });
            }
          },
        )
        .end(file);
    });
  }
}
