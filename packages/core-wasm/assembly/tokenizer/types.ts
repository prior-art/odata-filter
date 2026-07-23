import { RegExp } from '@prior-art/assemblyscript-regex/assembly/regexp';

export enum TokenType {
  WHITESPACE,
  TUPLE,
  OPEN_PAREN,
  CLOSE_PAREN,
  NULL,
  BOOLEAN,
  SYMBOL,
  STRING,
  NUMBER,
  AND,
  OR,
  IN,
  EQ,
  NE,
  LT,
  LTE,
  GT,
  GTE,
  NOT,
  DURATION,
  DATETIME,
  DATE,
  TIME,
  GUID,
}

export class TokenPattern {
  type: i32;
  regex: RegExp;
}

export enum TokenFormat {
  NULL,
  STRING,
  INTEGER,
  FLOAT,
  BOOLEAN,
  TUPLE,
  GUID,
}

export class TokenValue {
  format: TokenFormat;
  raw: string;
  stringValue: string = '';
  intValue: i32 = 0;
  floatValue: f32 = 0.0;
  boolValue: bool = false;
  arrayValue: Array<TokenValue> = [];
}

export class Token {
  type: i32;
  position: i32;
  value: TokenValue;
}
