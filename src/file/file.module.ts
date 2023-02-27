import { CollectionsModelsName } from 'src/constans/models';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { FileService } from './service/file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PathFiles } from './constans';
import { FileModel } from './file.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FileModel,
        schemaOptions: {
          collection: CollectionsModelsName.Files,
        },
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: PathFiles,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
