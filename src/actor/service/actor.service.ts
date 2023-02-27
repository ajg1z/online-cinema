import { CollectionsModelsName } from './../../constans/models';
import { ActorModel } from '../actor.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ObjectId } from 'mongodb';
import { ActorFindOnePayload, CreateActorPayload } from './actor.interface';
import { UpdateActorDto } from '../dto/update-actor.dto';
import { FileModel } from 'src/file/file.model';
import { getPathFile } from 'src/file/helpers';
import { FileService } from 'src/file/service/file.service';
import { CreateActorDto } from '../dto/create-actor.dto';
import { MovieService } from 'src/movie/service/movie.service';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private actorModel: ModelType<ActorModel>,
    private readonly fileService: FileService,
    private readonly movieService: MovieService,
  ) {}

  async findById(id: ObjectId) {
    const actor = await this.actorModel
      .findById(id)
      .populate({
        path: `photo`,
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .exec();

    if (!actor) throw new NotFoundException('actor not found');
    return actor;
  }

  async findOne(payload: ActorFindOnePayload) {
    const [key] = Object.keys(payload);
    const actor = await this.actorModel
      .findOne({ [key]: payload[key] })
      .populate({
        path: `photo`,
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .exec();
    if (!actor) throw new NotFoundException('actor not found');

    return actor;
  }

  async getCollections() {
    return await this.search();
  }

  async create(dto: CreateActorDto) {
    const sameActor = await this.actorModel.findOne({ slug: dto.slug });
    if (sameActor) throw new BadRequestException('slug busy');
    const actor = await this.actorModel.create(dto);
    return actor;
  }

  async update(id: ObjectId, payload: UpdateActorDto) {
    const actor = await this.findById(id);

    if (payload.slug) {
      const sameSlug = await this.actorModel.findOne({
        $and: [{ slug: payload.slug }, { _id: { $ne: id } }],
      });

      if (sameSlug)
        throw new BadRequestException('actor with slug already exist');
    }

    if (!actor) throw new NotFoundException('actor not found');

    return await this.actorModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();
  }

  async deleteOne(id: ObjectId) {
    const actor = await this.actorModel
      .findByIdAndRemove(id)
      .populate('photo')
      .exec();

    if (!actor) throw new NotFoundException('actor not found');
    await this.movieService.deleteActor(actor._id);
    await this.fileService.deleteMany(actor.photo.map((file) => file._id));

    return actor;
  }

  async getCount() {
    return await this.actorModel.count();
  }

  async search(params?: string) {
    let options = {};
    if (params)
      options = {
        $or: [
          {
            name: new RegExp(params, 'i'),
          },
          {
            slug: new RegExp(params, 'i'),
          },
        ],
      };

    const resultAggregate = await this.actorModel
      .aggregate()
      .match(options)
      .lookup({
        from: CollectionsModelsName.Movie,
        foreignField: 'actors',
        localField: '_id',
        as: 'movies',
      })
      .addFields({
        countMovies: {
          $size: '$movies',
        },
      })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({ createdAt: 'desc' })
      .exec();

    return await this.actorModel.populate(resultAggregate, {
      path: 'photo',
      transform: (doc: FileModel) => getPathFile(doc),
    });
  }
}
