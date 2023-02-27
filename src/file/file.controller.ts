import { ValidateString } from './pipes/validate-string';
import { FileService } from './service/file.service';
import {
  Controller,
  Post,
  UseInterceptors,
  HttpCode,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthorTypeFile } from './file.model';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('authorType') authorType: AuthorTypeFile,
  ) {
    return this.fileService.saveFiles(
      Array.isArray(files) ? files : [files],
      authorType,
    );
  }
}
