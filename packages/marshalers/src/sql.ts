import { NodeType, TokenType } from '@odata-filter/core';
import type { Node, TokenValue } from '@odata-filter/core';
import { sqlOperatorLookup } from './lookups';
import { toStringValue } from './utils';

const formatSqlValue = (value: TokenValue): string => {
  if (value === null) return 'NULL';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (Array.isArray(value)) return `(${value.map(formatSqlValue).join(', ')})`;
  return String(value);
};

export const toSqlWhere = (ast?: Node): string => {
  if (!ast) return '';

  const tokenType = ast.value && ast.value.toString().toLowerCase() + '_operator';

  if (ast.type === NodeType.LOGICAL_OPERATOR) {
    const left = toSqlWhere(ast.left);
    const right = toSqlWhere(ast.right);
    const operator = sqlOperatorLookup[tokenType as TokenType];

    return `(${left} ${operator} ${right})`;
  }

  if (ast.type === NodeType.COMPARISON_OPERATOR) {
    const isTrimFunction = ast.left?.type === NodeType.UNARY_FUNCTION;
    const field = isTrimFunction ? ast.left?.left?.value : ast.left?.value;
    const value = ast.right?.value;

    if (!field) return '';

    const operator = sqlOperatorLookup[tokenType as TokenType];

    if (isTrimFunction) {
      return `TRIM(${field}) ${operator} ${formatSqlValue(value ?? null)}`;
    }

    if (tokenType === TokenType.CONTAINS) {
      return `${field} ${operator} ${formatSqlValue(`%${toStringValue(value)}%`)}`;
    }

    if (tokenType === TokenType.STARTSWITH) {
      return `${field} ${operator} ${formatSqlValue(`${toStringValue(value)}%`)}`;
    }

    return `${field} ${operator} ${formatSqlValue(value ?? null)}`;
  }

  if (ast.type === NodeType.UNARY_OPERATOR) {
    const inner = toSqlWhere(ast.left);
    const operator = sqlOperatorLookup[tokenType as TokenType];
    return `${operator} (${inner})`;
  }

  return '';
};
