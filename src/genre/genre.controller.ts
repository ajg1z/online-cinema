import { IsObjectId } from '../user/pipes/is-object-id';
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
import { SearchGenreDto, UpdateGenreDto } from './dto';
import { GenreService } from './service/genre.service';
import { ObjectId } from 'mongodb';
import { get } from 'http';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('create')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateGenreDto) {
    return await this.genreService.create(dto);
  }

  @Get('by-slug/:slug')
  async getGenreBySlug(@Param('slug') slug: string) {
    return await this.genreService.findOne({ slug });
  }

  @Get('collections')
  async getCollections() {
    return await this.genreService.getCollections();
  }

  @Get('popular')
  async getPopular() {
    return await this.genreService.getPopular();
  }

  @Get()
  async getAll(@Query('q') q: string) {
    return await this.genreService.search(q);
  }

  @Get(':id')
  @Auth('admin')
  async getGenreById(@Param('id', IsObjectId) id: ObjectId) {
    return await this.genreService.findById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IsObjectId) id: ObjectId) {
    return await this.genreService.deleteOne(id);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id', IsObjectId) id: ObjectId,
    @Body() payload: UpdateGenreDto,
  ) {
    return await this.genreService.update(id, payload);
  }
}
