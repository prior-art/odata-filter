import { Node, NodeType } from '@prior-art/odata-filter-core';
import { Comparison } from './types';
import { isComparison } from './predicates';

export const filterComparisons = (ast: Node): Comparison[] => {
  const comparisons: Comparison[] = [];

  const recurse = (ast: Node): void => {
    if (isComparison(ast)) comparisons.push(ast);

    if (ast.left) recurse(ast.left);
    if (ast.right) recurse(ast.right);
  };

  recurse(ast);

  return comparisons;
};
