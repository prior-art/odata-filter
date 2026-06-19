import { TokenType, Lexer } from './types';

const defaultLexer: Lexer = {
  patterns: [
    {
      regex: /\s/,
      type: TokenType.WHITESPACE,
    },
    {
      regex: /\(((\d|'[^']*'),?\s?)+\)/,
      type: TokenType.TUPLE,
    },
    {
      regex: /\(/,
      type: TokenType.OPEN_PAREN,
    },
    {
      regex: /\)/,
      type: TokenType.CLOSE_PAREN,
    },
    {
      regex: /\bnull\b/,
      type: TokenType.NULL,
    },
    {
      regex: /\btrue\b/,
      type: TokenType.TRUE,
    },
    {
      regex: /\bfalse\b/,
      type: TokenType.FALSE,
    },
    {
      regex: /[a-zA-Z_](\/{0,1}[a-zA-Z-1-9_])*/,
      type: TokenType.SYMBOL,
    },
    {
      regex: /('[^'\\]*(?:\\.[^'\\]*)*')/,
      type: TokenType.STRING,
    },
    {
      regex: /\b\d+\b/,
      type: TokenType.NUMBER,
    },
  ],
  tokens: [],
  source: '',
  pos: 0,
};

export default defaultLexer;
