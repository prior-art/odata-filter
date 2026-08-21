import { Lexer, TokenType, Token, TokenPattern } from './types';
import { reservedKeywordLookup, valueFormatterLookup } from './lookups';
import { Temporal } from '@js-temporal/polyfill';
import { LexerException } from './exceptions';
import { stringFormatter } from './formatters';

const functionHandler = (lexer: Lexer, value: string): Token[] => {
  const functionMatcher = lexer.patterns.find((pattern) => pattern.type === TokenType.FUNCTION) as TokenPattern;
  const [_, functionName, _singleArg, doubleArg1, doubleArg2, singleSymbolArg] = value.match(functionMatcher.regex)!;

  switch (functionName) {
    case 'now':
      return [{
        value: Temporal.Now.instant(),
        type: TokenType.DATETIME,
        pos: lexer.pos,
      }]
    case 'contains': {
      const operator = "contains";
      return [{
        value: doubleArg1,
        type: TokenType.SYMBOL,
        pos: lexer.pos,
      }, {
        value: operator,
        type: TokenType.CONTAINS,
        pos: lexer.pos + doubleArg1.length,
      }, {
        value: stringFormatter(doubleArg2),
        type: TokenType.STRING,
        pos: lexer.pos + doubleArg1.length + operator.length,
      }];
    }
    case 'startswith': {
      const operator = "startswith";
      return [{
        value: doubleArg1,
        type: TokenType.SYMBOL,
        pos: lexer.pos,
      }, {
        value: operator,
        type: TokenType.STARTSWITH,
        pos: lexer.pos + doubleArg1.length,
      }, {
        value: stringFormatter(doubleArg2),
        type: TokenType.STRING,
        pos: lexer.pos + doubleArg1.length + operator.length,
      }];
    }
    case 'trim': {
      return [{
        value: 'trim',
        type: TokenType.TRIM,
        pos: lexer.pos,
      }, {
        value: singleSymbolArg,
        type: TokenType.SYMBOL,
        pos: lexer.pos + 'trim'.length,
      }];
    }
    default:
      throw new LexerException(`Unsupported function: ${value}`);
  }
}

const tokenHandler = (lexer: Lexer, type: TokenType, value: string): void => {
  if (type === TokenType.WHITESPACE) {
    lexer.pos += value.length;
    return;
  }

  if (type === TokenType.FUNCTION) {
    const tokens = functionHandler(lexer, value);

    tokens.forEach((token) => lexer.tokens.push(token));
    lexer.pos += value.length;

    return;
  }

  lexer.tokens.push({
    value: valueFormatterLookup[type](value),
    type: reservedKeywordLookup.hasOwnProperty(value)
      ? reservedKeywordLookup[value]
      : type,
    pos: lexer.pos,
  });
  lexer.pos += value.length;
};

export default tokenHandler;
