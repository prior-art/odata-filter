import { Temporal } from '@js-temporal/polyfill';

export enum TokenType {
  WHITESPACE = 'whitespace',
  STRING = 'string',
  SYMBOL = 'symbol',
  NUMBER = 'number',
  TUPLE = 'tuple',
  OPEN_PAREN = 'open_paren',
  CLOSE_PAREN = 'close_paren',
  IN = 'in_operator',
  EQ = 'eq_operator',
  NE = 'ne_operator',
  GT = 'gt_operator',
  GTE = 'gte_operator',
  LT = 'lt_operator',
  LTE = 'lte_operator',
  NOT = 'not_operator',
  AND = 'and_operator',
  OR = 'or_operator',
  TRUE = 'boolean_true',
  FALSE = 'boolean_false',
  NULL = 'null',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  DURATION = 'duration',
}

export type TokenValue =
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.Instant
  | Temporal.Duration
  | string
  | number
  | boolean
  | null
  | number[]
  | string[]
  | (string | number)[];

export type Token = {
  value: TokenValue;
  type: TokenType;
  pos: number;
};

export type TokenPattern = {
  regex: RegExp;
  type: TokenType;
};

export type Lexer = {
  patterns: TokenPattern[];
  tokens: Token[];
  source: string;
  pos: number;
};
