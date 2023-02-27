import { GenreModel } from './../genre/genre.model';
import { post, prop, queryMethod, Ref, types } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/actor.model';
import { FileModel } from 'src/file/file.model';
import { doc } from 'prettier';

export interface MovieModel extends Base {}

export class MovieParameters {
  @prop()
  year: number;

  @prop()
  duration: number;

  @prop()
  country: string;
}

export class MovieModel extends TimeStamps {
  @prop({ ref: () => FileModel, default: null })
  poster: Ref<FileModel>;

  @prop({ ref: () => FileModel, default: null })
  bigPoster: Ref<FileModel>;

  @prop()
  title: string;

  @prop()
  description: string;

  @prop({ unique: true })
  slug: string;

  @prop({ default: 4.0 })
  rating: number;

  @prop({ default: 0 })
  countOpened?: number;

  @prop({ type: MovieParameters })
  parameters?: MovieParameters;

  @prop({ ref: () => GenreModel })
  genres: Ref<GenreModel>[];

  @prop({ ref: () => ActorModel })
  actors: Ref<ActorModel>[];

  @prop()
  isSendTelegram?: boolean;

  @prop({ ref: () => FileModel, default: null })
  video: Ref<FileModel>;
}
