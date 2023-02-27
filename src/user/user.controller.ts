import { ObjectId } from 'mongodb';
import { UserService } from './service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './decorators/user';
import { IsObjectId } from './pipes/is-object-id';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: ObjectId) {
    return await this.userService.findById(_id);
  }

  @Put('profile')
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @User('_id') _id: ObjectId,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.userService.updateProfile(_id, payload);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id', IsObjectId) id: ObjectId,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.userService.updateProfile(id, payload, true);
  }

  @Get('search')
  @Auth('admin')
  @HttpCode(200)
  async search(@Query(`query`) query: string, @User('_id') _id: ObjectId) {
    return await this.userService.search(_id, query);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteUser(@Param('id', IsObjectId) id: ObjectId) {
    return await this.userService.deleteOne(id);
  }

  @Get('count')
  @Auth('admin')
  @HttpCode(200)
  async getCountUsers() {
    return await this.userService.getCount();
  }

  @Get(':id')
  @Auth('admin')
  @HttpCode(200)
  async getUser(@Param('id', IsObjectId) id: ObjectId) {
    return await this.userService.findById(id);
  }

  @Get('profile/favorites')
  @Auth()
  @HttpCode(200)
  async getFavorites(@User('_id') _id: ObjectId) {
    return await this.userService.getFavoriteMovies(_id);
  }

  @Put('profile/favorites')
  @Auth()
  @HttpCode(200)
  async toggleFavorite(
    @Body('movieId', IsObjectId) movieId: ObjectId,
    @User('_id') _id: ObjectId,
  ) {
    return await this.userService.toggleFavorite(movieId, _id);
  }
}
