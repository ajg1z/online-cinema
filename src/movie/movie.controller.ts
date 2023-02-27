import { MovieService } from './service/movie.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth';
import { ObjectId } from 'mongodb';
import { IsObjectId } from 'src/user/pipes/is-object-id';
import { UpdateCountOpenedDto, UpdateMovieDto } from './dto/update-movie.dto';
import { FindMovieByGenres } from './dto/find-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  async create(@Body() payload: CreateMovieDto) {
    return await this.movieService.create(payload);
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.movieService.findBySlug(slug);
  }

  @Get('by-actors/:actorId')
  async findByActors(@Param('actorId', IsObjectId) actorId: ObjectId) {
    return await this.movieService.findByActor(actorId);
  }

  @Post('by-genres')
  @UsePipes(new ValidationPipe())
  async findByGenres(@Body() payload: FindMovieByGenres) {
    return await this.movieService.findByGenres(payload.genres);
  }

  @Get()
  async getAll(@Query('query') query?: string) {
    return await this.movieService.search(query);
  }

  @Get('most-popular')
  async getMostPopular() {
    return await this.movieService.getMostPopular();
  }

  @Get(':id')
  @Auth('admin')
  async getGenreById(@Param('id', IsObjectId) id: ObjectId) {
    return await this.movieService.findById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IsObjectId) id: ObjectId) {
    return await this.movieService.deleteOne(id);
  }

  @Put('update-count-opened')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateCountOpened(@Body() payload: UpdateCountOpenedDto) {
    return await this.movieService.updateCountOpened(payload.slug);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', IsObjectId) id: ObjectId,
    @Body() payload: UpdateMovieDto,
  ) {
    return await this.movieService.update(id, payload);
  }
}
