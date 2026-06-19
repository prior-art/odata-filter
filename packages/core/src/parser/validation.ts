import { TokenType } from '../lexer/types';
import { Parser } from './types';
import { ParserException } from './exceptions';

export const validateParens = (parser: Parser): void => {
  let closedParens = false;
  let idx = parser.pos;

  for (let i = parser.pos + 1; i < parser.tokens.length; i++) {
    if (parser.tokens[i].type === TokenType.OPEN_PAREN) break;

    idx++;

    if (parser.tokens[i].type === TokenType.CLOSE_PAREN) {
      closedParens = true;
      break;
    }
  }

  const { value } = parser.tokens[idx];

  if (!closedParens) {
    throw new ParserException(`Expected ) but received ${value} instead`);
  }
};
