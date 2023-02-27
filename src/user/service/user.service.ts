import { hash, genSalt } from 'bcryptjs';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ObjectId } from 'mongodb';
import { ModelType } from '@typegoose/typegoose/lib/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../user.model';
import { isBoolean } from 'class-validator';
import { UserFindOnePayload, UserSearchParams } from './user.service-interface';
import { FileModel } from 'src/file/file.model';
import { getPathFile } from 'src/file/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async findById(id: ObjectId) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findOne(payload: UserFindOnePayload) {
    const user = await this.userModel.findOne({ email: payload.email }).exec();
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async updateProfile(id: ObjectId, payload: UpdateUserDto, isAdmin?: boolean) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not found');
    if (payload.email) {
      const isSameEmail = await this.userModel
        .findOne({ $and: [{ email: payload.email }, { _id: { $ne: id } }] })
        .exec();

      if (isSameEmail) throw new BadRequestException('email busy');
      user.email = payload.email;
    }

    if (payload.password) {
      const hashPassword = await hash(payload.password, await genSalt(4));
      user.password = hashPassword;
    }

    if (isAdmin && isBoolean(payload.isAdmin)) {
      user.isAdmin = payload.isAdmin;
    }

    return await user.save();
  }

  async deleteOne(id: ObjectId) {
    const user = await this.userModel.findByIdAndRemove(id).exec();
    if (!user) throw new NotFoundException('user not found');
    return {
      status: true,
    };
  }

  async getCount() {
    return await this.userModel.count().exec();
  }

  async search(userId: ObjectId, params?: string) {
    let options = {};
    if (params) {
      options = {
        $or: [
          {
            email: new RegExp(params, 'i'),
          },
        ],
        _id: { $not: userId },
      };
    }

    return await this.userModel
      .find(options)
      .select({ password: 0, updatedAt: 0, __v: 0 })
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async toggleFavorite(movieId: ObjectId, userId: ObjectId) {
    const { favorites } = await this.findById(userId);

    const strFavorites = favorites.map((el) => String(el));

    await this.userModel
      .findByIdAndUpdate(userId, {
        favorites: strFavorites.includes(String(movieId))
          ? favorites.filter((f) => String(f) !== String(movieId))
          : [...favorites, movieId],
      })
      .exec();
  }

  async getFavoriteMovies(id: ObjectId) {
    const result = await this.userModel
      .findById(id)
      .populate({
        path: 'favorites',
        populate: [
          {
            path: 'poster',
            transform: (doc: FileModel) => getPathFile(doc),
          },
          {
            path: 'bigPoster',
            transform: (doc: FileModel) => getPathFile(doc),
          },
          {
            path: 'video',
            transform: (doc: FileModel) => getPathFile(doc),
          },
          { path: 'genres' },
          {
            path: 'actors',
            populate: {
              path: 'photo',
              transform: (doc: FileModel) => getPathFile(doc),
            },
          },
        ],
      })
      .exec();

    return result.favorites;
  }
}
