import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ObjectId } from 'mongodb';
import { InjectModel } from 'nestjs-typegoose';
import { FileModel } from 'src/file/file.model';
import { getPathFile } from 'src/file/helpers';
import { FileService } from 'src/file/service/file.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieModel } from '../movie.model';
import { OutputMovie } from './movie.interface';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
    private readonly fileService: FileService,
  ) {}
  async findById(id: ObjectId) {
    const movie = await this.movieModel
      .findById(id)
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .exec();

    if (!movie) throw new NotFoundException('movie not found');
    return movie;
  }

  async findBySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate('actors genres');

    if (!movie) throw new NotFoundException('movie not found');
    return movie;
  }

  async deleteGenre(id: ObjectId) {
    const movies = await this.movieModel.find({ genres: { $in: [id] } });

    for (const movie of movies) {
      await this.movieModel.findByIdAndUpdate(movie._id, {
        genres: movie.genres.filter(
          (genre) => genre._id.toString() !== id.toString(),
        ),
      });
    }
  }

  async deleteActor(id: ObjectId) {
    const movies = await this.movieModel.find({ actors: { $in: [id] } });

    for (const movie of movies) {
      await this.movieModel.findByIdAndUpdate(movie._id, {
        actors: movie.actors.filter(
          (actor) => actor._id.toString() !== id.toString(),
        ),
      });
    }
  }

  async findByActor(actor: ObjectId) {
    const movies = await this.movieModel
      .find({ actors: actor })
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate('actors genres');

    if (!movies) throw new NotFoundException('movies not found');
    return movies;
  }

  async findByGenres(genreIds: ObjectId[]) {
    // * найти все фильмы имеющие указанные жанры
    const movies = (await this.movieModel
      .find({ genres: { $in: genreIds } })
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .exec()) as unknown as OutputMovie[];

    if (!movies) throw new NotFoundException('movies not found');

    return movies;
  }

  async create(payload: CreateMovieDto) {
    const sameMovie = await this.movieModel.findOne({ slug: payload.slug });
    if (sameMovie) throw new BadRequestException('slug busy');
    const movieModel = await this.movieModel.create(payload);
    return movieModel;
  }

  async update(id: ObjectId, payload: UpdateMovieDto) {
    if (payload.slug) {
      const sameSlug = await this.movieModel.findOne({
        $and: [{ slug: payload.slug }, { _id: { $ne: id } }],
      });
      if (sameSlug) throw new BadRequestException('slug busy');
    }

    return await this.movieModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }

  async updateRating(id: ObjectId, rating: number) {
    return await this.movieModel.findByIdAndUpdate(id, { rating });
  }

  async updateCountOpened(slug: string) {
    const updateMovie = await this.movieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      { new: true },
    );

    if (!updateMovie) throw new NotFoundException('movie not found');
  }

  async deleteOne(id: ObjectId) {
    const movieModel = await this.movieModel.findByIdAndRemove(id);
    if (!movieModel) throw new NotFoundException('movieModel not found');

    await this.fileService.deleteOne(movieModel.video._id);
    await this.fileService.deleteOne(movieModel.poster._id);
    await this.fileService.deleteOne(movieModel.bigPoster._id);
    return movieModel;
  }

  async getCount() {
    return await this.movieModel.count();
  }

  async search(params?: string) {
    let options = {};

    if (params) options = { $or: [{ title: new RegExp(params, 'i') }] };

    const results = await this.movieModel
      .find(options)
      .select({ updatedAt: 0, __v: 0 })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'actors',
        populate: {
          path: 'photo',
          transform: (doc: FileModel) => getPathFile(doc),
        },
      })
      .populate('genres')
      .exec();

    return results;
  }

  async getMostPopular() {
    return await this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate({
        path: 'poster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'bigPoster',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate({
        path: 'video',
        transform: (doc: FileModel) => getPathFile(doc),
      })
      .populate('genres')
      .limit(12);
  }
}
