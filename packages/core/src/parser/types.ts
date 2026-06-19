import { Token, TokenType, TokenValue } from '../lexer/types';

export type Parser = {
  tokens: Token[];
  pos: number;
  getCurrentToken: () => Token & TokenMeta;
};

export enum NodeType {
  DEFAULT = 'default',
  COMPARISON_OPERATOR = 'comparison_operator',
  UNARY_OPERATOR = 'unary_operator',
  LOGICAL_OPERATOR = 'logical_operator',
  FIELD = 'field',
  STRING_LITERAL = 'string_value',
  NUMBER_LITERAL = 'number_value',
  BOOLEAN_LITERAL = 'boolean_value',
  NULL = 'null',
  ARRAY = 'array',
}

type TokenMeta = {
  nodeType: NodeType;
  parseStrategy: ParseStrategy;
  bindingPower: BindingPower;
};

export enum BindingPower {
  DEFAULT,
  LOGICAL,
  COMPARISON,
  FIELD,
  LITERAL,
}

export type Node = {
  type?: NodeType;
  tokenType?: TokenType;
  value?: TokenValue;
  left?: Node;
  right?: Node;
};

export enum ParseStrategy {
  DEFAULT = 'default',
  NUD = 'nud',
  LED = 'led',
}
