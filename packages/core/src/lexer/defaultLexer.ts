import { TokenType, Lexer } from './types';

const symbolPattern = `[a-zA-Z_](?:\\/{0,1}[a-zA-Z-1-9_])*`;
const stringPattern = `'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'`;

const singleParamFunctionPattern = `\\s*(${stringPattern})\\s*`;
const doubleParamFunctionPattern = `\\s*(${symbolPattern})\\s*,\\s*(${stringPattern})\\s*`;
const singleSymbolParamFunctionPattern = `\\s*(${symbolPattern})\\s*`;
const noParamFunctionPattern = `\\s*`;

const defaultLexer: Lexer = {
  patterns: [
    {
      regex: new RegExp(`(${symbolPattern})\\s*\\((?:${singleParamFunctionPattern}|${doubleParamFunctionPattern}|${singleSymbolParamFunctionPattern}|${noParamFunctionPattern})\\)`),
      type: TokenType.FUNCTION,
    },
    {
      regex: /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/,
      type: TokenType.GUID,
    },
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
      regex: /P(?=\d|T\d)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?/,
      type: TokenType.DURATION,
    },
    {
      regex: new RegExp(symbolPattern),
      type: TokenType.SYMBOL,
    },
    {
      regex: new RegExp(stringPattern),
      type: TokenType.STRING,
    },
    {
      type: TokenType.DATETIME,
      regex: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/,
    },
    {
      type: TokenType.DATE,
      regex: /\d{4}-\d{2}-\d{2}\b/,
    },
    {
      type: TokenType.TIME,
      regex: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/,
    },
    /*
     * This regex matches numbers in scientific notation, such as:
     * 1.23e4
     * -5.67E-8
     * +9.10e+11
     * 3.14E0
     *
     * @author Elizabeth B. Clouser-Kuhn <clouser.elizabeth@protonmail.com>
     */
    {
      regex: /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d*)?\b/,
      type: TokenType.NUMBER,
    },
  ],
  tokens: [],
  source: '',
  pos: 0,
};

export default defaultLexer;
