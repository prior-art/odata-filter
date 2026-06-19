import { NodeType, TokenValue } from '@prior-art/odata-filter-core';

export type Comparison = {
  type: NodeType.COMPARISON_OPERATOR;
  value: 'eq' | 'gt' | 'gte' | 'in' | 'lt' | 'lte';
  left: {
    type: NodeType.FIELD;
    value: string;
  };
  right: {
    type:
      | NodeType.STRING_LITERAL
      | NodeType.NUMBER_LITERAL
      | NodeType.BOOLEAN_LITERAL
      | NodeType.NULL
      | NodeType.ARRAY;
    value: string | number | boolean | null | (string | number)[];
  };
};

type NoSchema = {};

type PrimitiveTypeSchema = {
  type: 'string' | 'number' | 'boolean';
};

type ArrayTypeSchema = {
  type: 'array';
  items: {
    type: 'string' | 'number';
  };
};

type ConstSchema = {
  const: string | number | boolean | null;
};

type EnumSchema = {
  enum: Array<TokenValue>;
};

type SchemaType =
  | NoSchema
  | PrimitiveTypeSchema
  | ArrayTypeSchema
  | ConstSchema
  | EnumSchema;

export type JsonSchema = Record<string, SchemaType>;
