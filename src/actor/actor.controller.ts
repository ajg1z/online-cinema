import { ActorService } from './service/actor.service';
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
import { SearchActorDto } from './dto/search-actor.dto';
import { IsObjectId } from 'src/user/pipes/is-object-id';
import { ObjectId } from 'mongodb';
import { UpdateActorDto } from './dto/update-actor.dto';
import { CreateActorDto } from './dto/create-actor.dto';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post('create')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateActorDto) {
    return await this.actorService.create(dto);
  }

  @Get('by-slug/:slug')
  async getGenreBySlug(@Param('slug') slug: string) {
    return await this.actorService.findOne({ slug });
  }

  @Get('collections')
  async getCollections() {
    return await this.actorService.getCollections();
  }

  @Get()
  async getAll(@Query('query') query?: string) {
    return await this.actorService.search(query);
  }

  @Get(':id')
  @Auth('admin')
  async getGenreById(@Param('id', IsObjectId) id: ObjectId) {
    return await this.actorService.findById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IsObjectId) id: ObjectId) {
    return await this.actorService.deleteOne(id);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id', IsObjectId) id: ObjectId,
    @Body() payload: UpdateActorDto,
  ) {
    return await this.actorService.update(id, payload);
  }
}
