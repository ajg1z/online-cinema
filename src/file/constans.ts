import { path } from 'app-root-path';

export const RootPathFilesFolder = `/uploads`;
export const PathFiles = `${path}/${RootPathFilesFolder}`;

export const PathsFiles = {
  root: RootPathFilesFolder,
  fullPathActors: `${RootPathFilesFolder}/actors`,
  fullPathMovies: `${RootPathFilesFolder}/movies`,
  actors: '/actors',
  movies: '/movies',
};
