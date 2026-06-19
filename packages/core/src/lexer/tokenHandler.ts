import { Lexer, TokenType, TokenValue } from './types';
import { reservedKeywordLookup, valueFormatterLookup } from './lookups';

const tokenHandler = (lexer: Lexer, type: TokenType, value: string): void => {
  if (type === TokenType.WHITESPACE) {
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
