import functionHandler from './functionHandler';
import defaultLexer from './defaultLexer';
import { TokenType } from './types';

const createLexer = () => ({
  ...defaultLexer,
  patterns: [...defaultLexer.patterns],
  tokens: [],
  source: '',
  pos: 0,
});

describe('#functionHandler', () => {
  test('it transforms contains() into comparison-style tokens', () => {
    const lexer = createLexer();
    const result = functionHandler(lexer, "contains(name, 'Smith')");

    expect(result).toEqual([
      { value: 'name', type: TokenType.SYMBOL, pos: 0 },
      { value: 'contains', type: TokenType.CONTAINS, pos: 4 },
      { value: 'Smith', type: TokenType.STRING, pos: 12 },
    ]);
  });

  test('it transforms startswith() into comparison-style tokens', () => {
    const lexer = createLexer();
    const result = functionHandler(lexer, "startswith(name, 'Smith')");

    expect(result).toEqual([
      { value: 'name', type: TokenType.SYMBOL, pos: 0 },
      { value: 'startswith', type: TokenType.STARTSWITH, pos: 4 },
      { value: 'Smith', type: TokenType.STRING, pos: 14 },
    ]);
  });

  test('it transforms endswith() into comparison-style tokens', () => {
    const lexer = createLexer();
    const result = functionHandler(lexer, "endswith(name, 'Smith')");

    expect(result).toEqual([
      { value: 'name', type: TokenType.SYMBOL, pos: 0 },
      { value: 'endswith', type: TokenType.ENDSWITH, pos: 4 },
      { value: 'Smith', type: TokenType.STRING, pos: 12 },
    ]);
  });

  test('it transforms trim() into unary-function-style tokens', () => {
    const lexer = createLexer();
    const result = functionHandler(lexer, 'trim(CompanyName)');

    expect(result).toEqual([
      { value: 'trim', type: TokenType.TRIM, pos: 0 },
      { value: 'CompanyName', type: TokenType.SYMBOL, pos: 4 },
    ]);
  });

  test('it transforms now() into a datetime token', () => {
    const lexer = createLexer();
    const result = functionHandler(lexer, 'now()');

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(TokenType.DATETIME);
    expect(result[0].pos).toBe(0);
  });

  test('it throws for unsupported functions', () => {
    const lexer = createLexer();
    const callback = () => functionHandler(lexer, "substring(name, 'S')");

    expect(callback).toThrow('Unsupported function: substring(name, \'S\')');
  });
});
