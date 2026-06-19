import { TokenPattern, TokenType } from './types.ts';
import { RegExp } from '@prior-art/assemblyscript-regex/assembly/regexp';

export const patterns = new Array<TokenPattern>();
patterns.push({
  type: TokenType.AND,
  regex: new RegExp('^and', ''),
});
patterns.push({
  type: TokenType.OR,
  regex: new RegExp('^or', ''),
});
patterns.push({
  type: TokenType.IN,
  regex: new RegExp('^in', ''),
});
patterns.push({
  type: TokenType.NE,
  regex: new RegExp('^ne', ''),
});
patterns.push({
  type: TokenType.LT,
  regex: new RegExp('^lt', ''),
});
patterns.push({
  type: TokenType.LTE,
  regex: new RegExp('^lte', ''),
});
patterns.push({
  type: TokenType.GTE,
  regex: new RegExp('^gte', ''),
});
patterns.push({
  type: TokenType.GT,
  regex: new RegExp('^gt', ''),
});
patterns.push({
  type: TokenType.NOT,
  regex: new RegExp('^not', ''),
});
patterns.push({
  type: TokenType.EQ,
  regex: new RegExp('^eq', ''),
});

patterns.push({
  type: TokenType.WHITESPACE,
  regex: new RegExp('\\s+', ''),
});
patterns.push({
  type: TokenType.TUPLE,
  regex: new RegExp("\\(((\\d|'[^']*'),?\\s?)+\\)", ''),
});
patterns.push({
  type: TokenType.OPEN_PAREN,
  regex: new RegExp('\\u0028', ''),
});
patterns.push({
  type: TokenType.CLOSE_PAREN,
  regex: new RegExp('\\u0029', ''),
});
patterns.push({
  type: TokenType.NULL,
  regex: new RegExp('^null', 'i'),
});
patterns.push({
  type: TokenType.BOOLEAN,
  regex: new RegExp('^(true|false)', 'i'),
});
patterns.push({
  type: TokenType.SYMBOL,
  regex: new RegExp('[a-zA-Z_](\\/{0,1}[a-zA-Z1-9_])*', ''),
});
patterns.push({
  type: TokenType.STRING,
  regex: new RegExp("('[^']*(?:.[^']*)*')", ''),
});
patterns.push({
  type: TokenType.NUMBER,
  regex: new RegExp('\\d+(?:\\.\\d+)?', ''),
});
