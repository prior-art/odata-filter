import { TokenPattern, TokenType } from './types.ts';
import { RegExp } from '@prior-art/assemblyscript-regex/assembly/regexp';

export const patterns = new Array<TokenPattern>();
patterns.push({
  type: TokenType.GUID,
  regex: new RegExp(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    '',
  ),
});
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
  type: TokenType.DURATION,
  regex: new RegExp(
    '^P(?:\\d+Y(?:\\d+M)?(?:\\d+D)?(?:T(?:\\d+H(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?|\\d+M(?:\\d+(?:\\.\\d+)?S)?|\\d+(?:\\.\\d+)?S))?|\\d+M(?:\\d+D)?(?:T(?:\\d+H(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?|\\d+M(?:\\d+(?:\\.\\d+)?S)?|\\d+(?:\\.\\d+)?S))?|\\d+D(?:T(?:\\d+H(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?|\\d+M(?:\\d+(?:\\.\\d+)?S)?|\\d+(?:\\.\\d+)?S))?|T(?:\\d+H(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?|\\d+M(?:\\d+(?:\\.\\d+)?S)?|\\d+(?:\\.\\d+)?S))',
    '',
  ),
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
  type: TokenType.DATETIME,
  regex: new RegExp(
    '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})',
    '',
  ),
});
patterns.push({
  type: TokenType.DATE,
  regex: new RegExp('\\d{4}-\\d{2}-\\d{2}', ''),
});
patterns.push({
  type: TokenType.TIME,
  regex: new RegExp('\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?', ''),
});
/*
 * This regex matches numbers in scientific notation, such as:
 * 1.23e4
 * -5.67E-8
 * +9.10e+11
 * 3.14E0
 *
 * @author Elizabeth B. Clouser-Kuhn <clouser.elizabeth@protonmail.com>
 */
patterns.push({
  type: TokenType.NUMBER,
  regex: new RegExp('^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d*)?'),
});
