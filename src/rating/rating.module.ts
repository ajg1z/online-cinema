import { MovieModule } from './../movie/movie.module';
import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CollectionsModelsName } from 'src/constans/models';
import { RatingModel } from './rating.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingModel,
        schemaOptions: {
          collection: CollectionsModelsName.Rating,
        },
      },
    ]),
    MovieModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
