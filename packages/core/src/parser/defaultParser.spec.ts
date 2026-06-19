import { TokenType } from '../lexer/types';
import defaultParser from './defaultParser';
import { ParserException } from './exceptions';
import { FilterQueryParserException } from '../exceptions';

describe('#defaultParser', () => {
  test('it fetches the current token', () => {
    const tokensStub = [
      { value: '(', type: TokenType.OPEN_PAREN, pos: 0 },
      { value: 'country', type: TokenType.SYMBOL, pos: 1 },
      { value: 'eq', type: TokenType.EQ, pos: 9 },
      { value: 'US', type: TokenType.STRING, pos: 12 },
      { value: 'and', type: TokenType.AND, pos: 17 },
      { value: 'age', type: TokenType.SYMBOL, pos: 21 },
      { value: 'gte', type: TokenType.GTE, pos: 25 },
      { value: 21, type: TokenType.NUMBER, pos: 29 },
      { value: ')', type: TokenType.CLOSE_PAREN, pos: 31 },
      { value: 'or', type: TokenType.OR, pos: 33 },
      { value: '(', type: TokenType.OPEN_PAREN, pos: 36 },
      { value: 'country', type: TokenType.SYMBOL, pos: 37 },
      { value: 'eq', type: TokenType.EQ, pos: 45 },
      { value: 'Canada', type: TokenType.STRING, pos: 48 },
      { value: 'and', type: TokenType.AND, pos: 57 },
      { value: 'age', type: TokenType.SYMBOL, pos: 61 },
      { value: 'gte', type: TokenType.GTE, pos: 65 },
      { value: 19, type: TokenType.NUMBER, pos: 69 },
      { value: ')', type: TokenType.CLOSE_PAREN, pos: 71 },
    ];

    const parser = {
      ...defaultParser,
      tokens: tokensStub,
    };

    const result = parser.getCurrentToken();

    expect(result).toEqual({
      value: '(',
      type: TokenType.OPEN_PAREN,
      pos: 0,
      bindingPower: 0,
      nodeType: 'default',
      parseStrategy: 'nud',
    });
  });

  test('it guards against invalid token positions', () => {
    expect.hasAssertions();

    const parser = {
      ...defaultParser,
      tokens: [],
    };

    try {
      parser.getCurrentToken();
    } catch (e) {
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e).toBeInstanceOf(ParserException);
      expect(e.message).toEqual('Token range exceeded.');
    }
  });
});
