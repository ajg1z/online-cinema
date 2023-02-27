import { ObjectId } from 'mongodb';
import { MovieService } from './../movie/service/movie.service';
import { RatingModel } from './rating.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { SetRatingDto } from './dto/set-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel)
    private readonly ratingModel: ModelType<RatingModel>,
    private readonly movieService: MovieService,
  ) {}

  async getRating(movieId: ObjectId, userId: ObjectId) {
    const rating = await this.ratingModel.findOne({ movieId, userId }).exec();
    return rating ? rating.value : 0;
  }

  async getAverRatingMovie(movieId: ObjectId) {
    const ratingsMovie: RatingModel[] = await this.ratingModel
      .find({ movieId })
      .exec();

    if (!ratingsMovie.length) return 0;

    return (
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingsMovie.length
    );
  }

  async setRating(userId: ObjectId, { movieId, value }: SetRatingDto) {
    const rating = await this.ratingModel
      .findOneAndUpdate(
        { userId, movieId },
        {
          value,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();

    const averageRating = await this.getAverRatingMovie(movieId);

    await this.movieService.updateRating(movieId, averageRating);

    return rating.value;
  }
}
