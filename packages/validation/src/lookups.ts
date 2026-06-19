import { NodeType, TokenValue } from '@prior-art/odata-filter-core';

export const jsonTypeLookup: Record<string, TokenValue> = {
  [NodeType.STRING_LITERAL]: 'string',
  [NodeType.NUMBER_LITERAL]: 'number',
  [NodeType.BOOLEAN_LITERAL]: 'boolean',
  [NodeType.ARRAY]: 'array',
};
