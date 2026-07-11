import { TokenFormat, TokenValue } from '../tokenizer/types';

export enum NodeType {
  DEFAULT,
  COMPARISON_OPERATOR,
  UNARY_OPERATOR,
  LOGICAL_OPERATOR,
  FIELD,
  STRING_LITERAL,
  NUMBER_LITERAL,
  BOOLEAN_LITERAL,
  TIME_LITERAL,
  DATE_LITERAL,
  DATETIME_LITERAL,
  DURATION_LITERAL,
  NULL,
  ARRAY,
}

export enum BindingPower {
  DEFAULT,
  LOGICAL,
  COMPARISON,
  FIELD,
  LITERAL,
}

export enum ParseStrategy {
  DEFAULT,
  NUD,
  LED,
}

export class AST {
  type: NodeType = NodeType.DEFAULT;
  value: TokenValue = { format: TokenFormat.STRING, raw: '' };
  left: AST | null;
  right: AST | null;
}
