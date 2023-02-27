import { TelegramModule } from './../telegram/telegram.module';
import { CollectionsModelsName } from './../constans/models';
import { MovieModel } from './movie.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { MovieService } from './service/movie.service';
import { MovieController } from './movie.controller';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    FileModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: MovieModel,
        schemaOptions: {
          collection: CollectionsModelsName.Movie,
        },
      },
    ]),
    TelegramModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
