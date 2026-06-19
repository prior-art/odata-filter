import type { Node } from '@prior-art/odata-filter-core';
import type { Filter } from 'mongodb';

export type QueryFilter = {
  filter: string;
  filterParsed: Node|Filter<unknown>;
};
