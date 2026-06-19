import { Node, NodeType } from '@prior-art/odata-filter-core';
import { JsonSchema } from './types';
import { filterComparisons } from './compare';
import {
  assertValidEnum,
  assertValidConst,
  assertValidField,
  assertValidType,
  assertValidItemsType,
  assertValidItemsConst,
  assertValidItemsEnum,
} from './rules';

export type { JsonSchema } from './types';

export const validate = (ast: Node, schema: JsonSchema): void => {
  const comparisons = filterComparisons(ast);

  comparisons.forEach((comparison) => {
    assertValidField(schema, comparison);
    assertValidItemsType(schema, comparison);
    assertValidType(schema, comparison);
    assertValidItemsConst(schema, comparison);
    assertValidConst(schema, comparison);
    assertValidItemsEnum(schema, comparison);
    assertValidEnum(schema, comparison);
  });
};
