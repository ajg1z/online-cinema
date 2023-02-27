import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectId } from 'mongodb';
import { FullActorModel } from 'src/actor/service/actor.interface';
import { FileModel } from 'src/file/file.model';
import { GenreModel } from 'src/genre/genre.model';
import { MovieParameters } from '../movie.model';

export interface MovieFindOnePayload {
  slug: string;
  actor: ObjectId;
}

export interface FullMovieModel extends TimeStamps {
  _id: ObjectId;
  poster: FileModel;
  bigPoster: FileModel;
  title: string;
  description: string;
  slug: string;
  rating: number;
  countOpened?: number;
  parameters?: MovieParameters;
  genres: GenreModel[];
  actors: FullActorModel[];
  isSendTelegram?: boolean;
  video: FileModel;
}

export interface OutputMovie {
  _id: ObjectId;
  poster: string;
  bigPoster: string;
  title: string;
  description: string;
  slug: string;
  rating: number;
  countOpened?: number;
  parameters?: MovieParameters;
  genres: GenreModel[];
  actors: FullActorModel[];
  isSendTelegram?: boolean;
  video: string;
}
