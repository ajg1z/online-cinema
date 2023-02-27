import { AuthorTypeFile } from './file.model';
import { PathsFiles } from './constans';
import { FullPathPayload } from './service/file.interface';

export function getPathByAuthorType(
  authorType: AuthorTypeFile,
  mimetype?: string,
) {
  switch (authorType) {
    case `actor`:
      return PathsFiles.actors;
    case 'movie':
      if (mimetype.includes('image')) return PathsFiles.movies + '/images';
      if (mimetype.includes('video')) return PathsFiles.movies + '/videos';
      return PathsFiles.movies;
    default:
      return '';
  }
}

export function getPathFile(file: FullPathPayload) {
  if (!file) return ``;

  return (
    '/uploads' +
    getPathByAuthorType(file.authorType, file.type) +
    '/' +
    file.name
  );
}
