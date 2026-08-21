import { Temporal } from '@js-temporal/polyfill';
import { Lexer, TokenType, Token, TokenPattern } from './types';
import { LexerException } from './exceptions';
import { stringFormatter } from './formatters';

const createTwoParamFunctionTokens = (
  lexer: Lexer,
  field: string,
  rawValue: string,
  operator: TokenType.CONTAINS | TokenType.STARTSWITH | TokenType.ENDSWITH,
): Token[] => {
  const operatorValue = operator.split('_')[0];

  return [{
    value: field,
    type: TokenType.SYMBOL,
    pos: lexer.pos,
  }, {
    value: operatorValue,
    type: operator,
    pos: lexer.pos + field.length,
  }, {
    value: stringFormatter(rawValue),
    type: TokenType.STRING,
    pos: lexer.pos + field.length + operatorValue.length,
  }];
};

const functionHandler = (lexer: Lexer, value: string): Token[] => {
  const functionMatcher = lexer.patterns.find((pattern) => pattern.type === TokenType.FUNCTION) as TokenPattern;
  const [_, functionName, _singleArg, doubleArg1, doubleArg2, singleSymbolArg] = value.match(functionMatcher.regex)!;

  switch (functionName) {
    case 'now':
      return [{
        value: Temporal.Now.instant(),
        type: TokenType.DATETIME,
        pos: lexer.pos,
      }];
    case 'contains':
      return createTwoParamFunctionTokens(
        lexer,
        doubleArg1,
        doubleArg2,
        TokenType.CONTAINS,
      );
    case 'startswith':
      return createTwoParamFunctionTokens(
        lexer,
        doubleArg1,
        doubleArg2,
        TokenType.STARTSWITH,
      );
    case 'endswith':
      return createTwoParamFunctionTokens(
        lexer,
        doubleArg1,
        doubleArg2,
        TokenType.ENDSWITH,
      );
    case 'trim':
      return [{
        value: 'trim',
        type: TokenType.TRIM,
        pos: lexer.pos,
      }, {
        value: singleSymbolArg,
        type: TokenType.SYMBOL,
        pos: lexer.pos + 'trim'.length,
      }];
    default:
      throw new LexerException(`Unsupported function: ${value}`);
  }
};

export default functionHandler;
