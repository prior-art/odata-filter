import { NodeType, TokenType } from '@odata-filter/core';
import type { Node } from '@odata-filter/core';
import { mongoOperatorLookup } from './lookups';
import { Filter } from 'mongodb';

export const toMongoJson = (
  ast?: Node,
  json: Filter<unknown> = {},
): Filter<unknown> => {
  if (!ast) return json;

  const tokenType = ast.value && ast.value.toString().toLowerCase() + '_operator';

  if (ast.type === NodeType.LOGICAL_OPERATOR) {
    if (tokenType === TokenType.AND) {
      const leftJson = toMongoJson(ast.left, json);
      return toMongoJson(ast.right, leftJson);
    }

    const leftJson = toMongoJson(ast.left);
    const rightJson = toMongoJson(ast.right);

    const operator = mongoOperatorLookup[tokenType as TokenType];
    json[operator] = [leftJson, rightJson];
    return json;
  }

  if (ast.type === NodeType.COMPARISON_OPERATOR) {
    const field = ast.left?.value;
    const value = ast.right?.value;

    if (!field) return json;

    // Take only the first value in the filter per parameter.
    if (json[field.toString()] !== undefined) return json;

    if ([TokenType.EQ, TokenType.IN].includes(tokenType as TokenType)) {
      json[field.toString()] = value;
      return json;
    }

    const operator = mongoOperatorLookup[tokenType as TokenType];
    json[field.toString()] = { [operator]: value };
    return json;
  }

  if (ast.type === NodeType.UNARY_OPERATOR) {
    // by definition, Unary Operators only have a single condition ("left" for our purposes)
    const leftJson = toMongoJson(ast.left);
    const operator = mongoOperatorLookup[tokenType as TokenType];
    json[operator] = leftJson;
    return json;
  }

  return json;
}
