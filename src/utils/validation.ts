import { QueryParams } from '../types/params';

const isEmptyQueryParams = (params: QueryParams) => {
  return Object.values(params).every(param => param === undefined);
}

export {
  isEmptyQueryParams,
}