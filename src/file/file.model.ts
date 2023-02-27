import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface FileModel extends Base {}

export type FileType = `image` | `video` | 'pdf';
export type AuthorTypeFile = 'actor' | 'movie';

export class FileModel extends TimeStamps {
  @prop()
  size: number;

  @prop()
  name: string;

  @prop()
  type: FileType;

  @prop()
  authorType: AuthorTypeFile;
}
