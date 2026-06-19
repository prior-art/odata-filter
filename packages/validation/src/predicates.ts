import { Node, NodeType } from '@prior-art/odata-filter-core';
import { Comparison } from './types';
import { ValidationException } from './exceptions';

export const isComparison = (ast: Node): ast is Comparison => {
  const comparison = ast as Comparison;

  const shouldBe = comparison.type === NodeType.COMPARISON_OPERATOR;
  const is =
    'left' in comparison &&
    'type' in comparison.left &&
    'value' in comparison.left &&
    'right' in comparison &&
    'type' in comparison.right &&
    'value' in comparison.right;

  if (shouldBe && !is) {
    throw new ValidationException('Invalid comparison');
  }

  return shouldBe && is;
};
