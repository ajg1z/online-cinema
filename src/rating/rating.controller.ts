import { IsObjectId } from './../user/pipes/is-object-id';
import { ObjectId } from 'mongodb';
import { RatingService } from './rating.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth';
import { User } from 'src/user/decorators/user';
import { SetRatingDto } from './dto/set-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getRating(
    @Param('movieId', IsObjectId) movieId: ObjectId,
    @User('_id') _id: ObjectId,
  ) {
    return await this.ratingService.getRating(movieId, _id);
  }

  @Post('set-rating')
  @Auth()
  @UsePipes(new ValidationPipe())
  async setRating(@Body() dto: SetRatingDto, @User('_id') _id: ObjectId) {
    return await this.ratingService.setRating(_id, dto);
  }
}
