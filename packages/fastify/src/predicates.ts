import { QueryFilter } from './types';

export const queryHasFilter = (query: unknown): query is QueryFilter => {
  return (query as QueryFilter).filter !== undefined;
};
