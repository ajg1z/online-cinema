import { MovieModule } from './../movie/movie.module';
import { Module } from '@nestjs/common';
import { ActorService } from './service/actor.service';
import { ActorController } from './actor.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { CollectionsModelsName } from 'src/constans/models';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    FileModule,
    MovieModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: ActorModel,
        schemaOptions: {
          collection: CollectionsModelsName.Actors,
        },
      },
    ]),
  ],
  providers: [ActorService],
  controllers: [ActorController],
})
export class ActorModule {}
