import { ObjectId } from 'mongodb';
import { Ref } from '@typegoose/typegoose';
import { FileModel } from 'src/file/file.model';

export interface ActorFindOnePayload {
  slug: string;
}

export interface CreateActorPayload {
  slug: string;
  photo: FileModel[];
  name: string;
}

export interface ActorSearchParams {
  slug: RegExp;
  name: RegExp;
}

export interface FullActorModel {
  _id: ObjectId;

  slug: string;

  name: string;

  photo: FileModel[];
}
