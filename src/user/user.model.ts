import { MovieModel } from './../movie/movie.model';
import { prop, Ref, ReturnModelType } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose, { Types } from 'mongoose';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop({})
  password: string;

  @prop({ default: false })
  isAdmin?: boolean;

  @prop({ default: [], ref: () => MovieModel })
  favorites?: Ref<MovieModel>[];
}
