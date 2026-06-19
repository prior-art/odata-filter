import { Token } from '../lexer/types';
import { Node, Parser } from './types';
import defaultParser from './defaultParser';
import { handler } from './handlers';

export const parse = (tokens: Token[]): Node => {
  let left = {};

  const parser = {
    ...defaultParser,
    tokens,
  };

  while (parser.pos < parser.tokens.length) {
    left = handler(parser);
  }

  return left;
};
