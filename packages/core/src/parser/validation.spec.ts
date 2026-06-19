import { validateParens } from './validation';
import defaultParser from './defaultParser';
import { TokenType } from '../lexer/types';

describe('#validateParens', () => {
  test('it throws an exception when paren groupings are not closed', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: '(', type: TokenType.OPEN_PAREN, pos: 0 },
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
        { value: 'and', type: TokenType.AND, pos: 17 },
        { value: 'age', type: TokenType.SYMBOL, pos: 21 },
        { value: 'gte', type: TokenType.GTE, pos: 25 },
        { value: 21, type: TokenType.NUMBER, pos: 29 },
      ],
    };

    const result = () => validateParens(parserStub);

    expect(result).toThrow('Expected ) but received 21 instead');
  });

  test('it does nothing when paren groupings are closed', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: '(', type: TokenType.OPEN_PAREN, pos: 0 },
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
        { value: 'and', type: TokenType.AND, pos: 17 },
        { value: 'age', type: TokenType.SYMBOL, pos: 21 },
        { value: 'gte', type: TokenType.GTE, pos: 25 },
        { value: 21, type: TokenType.NUMBER, pos: 29 },
        { value: ')', type: TokenType.CLOSE_PAREN, pos: 31 },
      ],
    };

    const result = () => validateParens(parserStub);

    expect(result).not.toThrow(Error);
  });

  test('it reports only the first error', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: '(', type: TokenType.OPEN_PAREN, pos: 0 },
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
        { value: 'and', type: TokenType.AND, pos: 17 },
        { value: 'age', type: TokenType.SYMBOL, pos: 21 },
        { value: 'gte', type: TokenType.GTE, pos: 25 },
        { value: 21, type: TokenType.NUMBER, pos: 29 },
        { value: 'or', type: TokenType.OR, pos: 33 },
        { value: '(', type: TokenType.OPEN_PAREN, pos: 36 },
        { value: 'country', type: TokenType.SYMBOL, pos: 37 },
        { value: 'eq', type: TokenType.EQ, pos: 45 },
        { value: 'Canada', type: TokenType.STRING, pos: 48 },
        { value: 'and', type: TokenType.AND, pos: 57 },
        { value: 'age', type: TokenType.SYMBOL, pos: 61 },
        { value: 'gte', type: TokenType.GTE, pos: 65 },
        { value: 19, type: TokenType.NUMBER, pos: 69 },
      ],
    };

    const result = () => validateParens(parserStub);

    expect(result).toThrow('Expected ) but received or instead');
  });

  test('it looks ahead of the current parser position', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
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
      ],
      pos: 10,
    };

    const result = () => validateParens(parserStub);

    expect(result).toThrow('Expected ) but received 19 instead');
  });
});
