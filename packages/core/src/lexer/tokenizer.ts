import { Lexer, Token } from './types';
import defaultLexer from './defaultLexer';
import tokenHandler from './tokenHandler';
import { LexerException } from './exceptions';

export const tokenize = (source: string): Token[] => {
  const lexer = {
    ...defaultLexer,
    tokens: [],
    source,
  };

  while (lexer.pos < source.length) {
    const remainder = source.substr(lexer.pos);

    let matched = false;
    for (let { regex, type } of lexer.patterns) {
      const match = remainder.match(regex);

      if (match && match.index === 0) {
        const [value] = match;

        tokenHandler(lexer, type, value);

        matched = true;

        break;
      }
    }

    if (!matched) {
      throw new LexerException(`Unexpected token near ${remainder}`);
    }
  }

  return lexer.tokens;
};
