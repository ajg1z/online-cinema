import { CreateGenreDto } from './../dto/create-genre.dto';
import { CollectionsModelsName } from './../../constans/models';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ObjectId } from 'mongodb';
import { InjectModel } from 'nestjs-typegoose';
import { getPathFile, getPathByAuthorType } from 'src/file/helpers';
import { MovieService } from 'src/movie/service/movie.service';
import { UpdateGenreDto, SearchGenreDto } from '../dto';
import { GenreModel } from '../genre.model';
import {
  CreateGenrePayload,
  GenreFindOnePayload,
  GenreSearchParams,
  ICollection,
} from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService,
  ) {}

  async findById(id: ObjectId) {
    const genre = await this.genreModel.findById(id);
    if (!genre) throw new NotFoundException('genre not found');
    return genre;
  }

  async findOne(payload: GenreFindOnePayload) {
    const [key] = Object.keys(payload);
    const genre = await this.genreModel.findOne({ [key]: payload[key] });
    if (!genre) throw new NotFoundException('genre not found');

    return genre;
  }

  async getCollections() {
    const genres = await this.search();

    const collections = Promise.all(
      genres.map(async (genre) => {
        const movies = await this.movieService.findByGenres([genre._id]);

        const collectionItem: ICollection = {
          _id: genre._id,
          image: movies.length ? movies[0].bigPoster : '',
          slug: genre.slug,
          title: genre.name,
        };
        return collectionItem;
      }),
    );
    return collections;
  }

  async create(payload: CreateGenreDto) {
    const sameName = await this.genreModel.findOne({ name: payload.name });
    const sameSlug = await this.genreModel.findOne({ slug: payload.slug });
    if (sameName) throw new BadRequestException('name busy');
    if (sameSlug) throw new BadRequestException('slug busy');
    return await this.genreModel.create(payload);
  }

  async update(id: ObjectId, payload: UpdateGenreDto, isAdmin?: boolean) {
    const genre = await this.findById(id);
    let updatePayload = {} as UpdateGenreDto;

    if (payload.name) {
      const isSameName = await this.genreModel.findOne({
        $and: [{ name: payload.name }, { _id: { $ne: id } }],
      });

      if (isSameName) throw new BadRequestException('genre busy');
      updatePayload.name = payload.name;
    }

    if (payload.slug) {
      const isSameSlug = await this.genreModel.findOne({
        $and: [{ slug: payload.slug }, { _id: { $ne: id } }],
      });

      if (isSameSlug) throw new BadRequestException('slug busy');
      updatePayload.slug = payload.slug;
    }

    updatePayload = { ...payload, ...updatePayload };

    return await this.genreModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
  }

  async deleteOne(id: ObjectId) {
    const genre = await this.genreModel.findByIdAndRemove(id);
    if (!genre) throw new NotFoundException('genre not found');
    await this.movieService.deleteGenre(genre._id);
    return genre;
  }

  async getCount() {
    return await this.genreModel.count();
  }

  async getPopular(limit: number = 4) {
    return await this.genreModel
      .aggregate()
      .lookup({
        from: CollectionsModelsName.Movie,
        foreignField: 'genres',
        localField: '_id',
        as: 'movies',
      })
      .addFields({
        countMovies: {
          $size: '$movies',
        },
      })
      .sort({ countMovies: 'desc' })
      .limit(limit)
      .project({ movies: 0, __v: 0 })
      .exec();
  }

  async search(params?: string) {
    let options = {};

    if (params) {
      options = {
        $or: [
          { name: new RegExp(params, `i`) },
          { slug: new RegExp(params, `i`) },
          { description: new RegExp(params, `i`) },
        ],
      };
    }

    return await this.genreModel
      .find(options)
      .select({ updatedAt: 0, __v: 0 })
      .sort({ createdAt: 'desc' })
      .exec();
  }
}
