import { ObjectId } from 'mongodb';
export interface GenreFindOnePayload {
  name?: string;
  slug?: string;
  description?: string;
}

export interface GenreSearchParams {
  name: RegExp;
  description: RegExp;
  slug: RegExp;
}

export interface CreateGenrePayload {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface ICollection {
  _id: ObjectId;
  image: string;
  slug: string;
  title: string;
}
