import { Parser } from './parser';
import { TokenType } from '../tokenizer/types';

export function validateParens(parser: Parser): void {
  let closedParens = false;
  let idx = parser.pos;

  for (let i = parser.pos + 1; i < parser.tokens.length; i++) {
    if (parser.tokens[i].type === TokenType.OPEN_PAREN) {
      break;
    }

    idx = idx + 1;

    if (parser.tokens[i].type === TokenType.CLOSE_PAREN) {
      closedParens = true;
      break;
    }
  }

  const token = parser.getCurrentToken();

  if (!closedParens) {
    throw new Error(`Expected ) but received ${token.value.raw} instead.`);
  }
}
