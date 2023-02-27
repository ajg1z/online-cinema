import { getPathFile } from 'src/file/helpers';
import { types } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

interface QueryHelpers {
  findFull: types.AsQueryMethod<typeof findFull>;
}

type ModelType = 'actor' | 'movie';

interface FindQueryParams {
  type: ModelType;
  options: Record<string, unknown>;
}

export async function findFull<T extends AnyParamConstructor<any>>(
  this: types.QueryHelperThis<T, QueryHelpers>,
  options: FindQueryParams,
) {
  const { type, ...params } = options;

  if (options.type === 'actor')
    return (await this.find(params).populate('photo')).map((doc: any) => ({
      ...doc,
      photo: doc.photo.map((photo) => getPathFile(photo)),
    }));
}
