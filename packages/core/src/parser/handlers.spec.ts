import { handler } from './handlers';
import defaultParser from './defaultParser';
import { TokenType } from '../lexer/types';
import { ParserException } from './exceptions';
import { FilterQueryParserException } from '../exceptions';

describe('#handler', () => {
  test('it processes nud tokens', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
      ],
    };
    const result = handler(parserStub);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'country' },
      right: { type: 'string_value', value: 'US' },
    });
  });

  test('it supports the IN operator', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'id', type: TokenType.SYMBOL, pos: 0 },
        { value: 'in', type: TokenType.IN, pos: 3 },
        { value: [1, 2, 3], type: TokenType.TUPLE, pos: 6 },
      ],
    };

    const result = handler(parserStub);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'in',
      left: { type: 'field', value: 'id' },
      right: { type: 'array', value: [1, 2, 3] },
    });
  });

  test('it guards against invalid IN values', () => {
    expect.hasAssertions();

    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'id', type: TokenType.SYMBOL, pos: 0 },
        { value: 'in', type: TokenType.IN, pos: 3 },
        { value: 1, type: TokenType.NUMBER, pos: 6 },
      ],
    };

    try {
      handler(parserStub);
    } catch (e) {
      expect(e.message).toEqual(
        'Operator of type "in" expects array, received number_value',
      );
      expect(e).toBeInstanceOf(ParserException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('ParserException');
    }
  });

  test('it supports the NOT operator', () => {
    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'not', type: TokenType.NOT, pos: 1 },
        { value: 'country', type: TokenType.SYMBOL, pos: 5 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
      ],
    };
    const result = handler(parserStub);

    expect(result).toEqual({
      type: 'unary_operator',
      value: 'not',
      left: {
        type: 'comparison_operator',
        value: 'eq',
        left: { type: 'field', value: 'country' },
        right: { type: 'string_value', value: 'US' },
      },
    });
  });

  test('it throws an error when passing non-numeric values to a numeric comparison operator', () => {
    expect.hasAssertions();

    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'age', type: TokenType.SYMBOL, pos: 0 },
        { value: 'gte', type: TokenType.GTE, pos: 4 },
        { value: '21', type: TokenType.STRING, pos: 8 },
      ],
    };

    try {
      handler(parserStub);
    } catch (e) {
      expect(e.message).toEqual(
        'Operator of type gte expects number_value, received string_value',
      );
      expect(e).toBeInstanceOf(ParserException);
      expect(e.name).toBe('ParserException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
    }
  });

  test('it throws an error for invalid comparison operator values', () => {
    expect.hasAssertions();

    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'name', type: TokenType.SYMBOL, pos: 0 },
        { value: 'eq', type: TokenType.EQ, pos: 5 },
        { value: ['a', 'b'], type: TokenType.TUPLE, pos: 8 },
      ],
    };

    try {
      handler(parserStub);
    } catch (e) {
      expect(e.message).toEqual(
        'Operator of type eq expects one of the following types: string_value, number_value, or boolean_value. Received array.',
      );
      expect(e).toBeInstanceOf(ParserException);
      expect(e.name).toBe('ParserException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
    }
  });

  test('it throws an error for invalid nud tokens', () => {
    expect.hasAssertions();

    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: ')', type: TokenType.CLOSE_PAREN, pos: 0 },
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'eq', type: TokenType.EQ, pos: 9 },
        { value: 'US', type: TokenType.STRING, pos: 12 },
      ],
    };

    try {
      handler(parserStub);
    } catch (e) {
      expect(e.message).toEqual('NUD handler expected for token )');
      expect(e).toBeInstanceOf(ParserException);
      expect(e.name).toBe('ParserException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
    }
  });

  test('it throws an error for invalid led tokens', () => {
    expect.hasAssertions();

    const parserStub = {
      ...defaultParser,
      tokens: [
        { value: 'country', type: TokenType.SYMBOL, pos: 1 },
        { value: 'US', type: TokenType.STRING, pos: 9 },
      ],
    };

    try {
      handler(parserStub);
    } catch (e) {
      expect(e.message).toEqual('LED handler expected for token US');
      expect(e).toBeInstanceOf(ParserException);
      expect(e.name).toBe('ParserException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
    }
  });
});
