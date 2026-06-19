import { AST } from './types';
import { TokenType, Token } from '../tokenizer/types';
import { Parser } from './parser';
import { handler } from './handler';

export function parse(tokens: Array<Token>): AST {
  let left = {} as AST;

  const filteredTokens = tokens.filter((token) => {
    return token.type !== TokenType.WHITESPACE;
  });

  const parser = new Parser(filteredTokens);

  while (parser.pos < parser.tokens.length) {
    left = handler(parser);
  }

  return left;
}
