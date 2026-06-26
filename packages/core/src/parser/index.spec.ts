import { TokenType } from '../lexer/types';
import { parse } from '.';
import { tokenize } from '..';
import { Temporal } from '@js-temporal/polyfill';

describe('#parse', () => {
  test('it transforms tokens into an abstract syntax tree', () => {
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

    const result = parse(tokensStub);

    expect(result).toEqual({
      type: 'logical_operator',
      value: 'or',
      left: {
        type: 'logical_operator',
        value: 'and',
        left: {
          type: 'comparison_operator',
          value: 'eq',
          left: { type: 'field', value: 'country' },
          right: { type: 'string_value', value: 'US' },
        },
        right: {
          type: 'comparison_operator',
          value: 'gte',
          left: { type: 'field', value: 'age' },
          right: { type: 'number_value', value: 21 },
        },
      },
      right: {
        type: 'logical_operator',
        value: 'and',
        left: {
          type: 'comparison_operator',
          value: 'eq',
          left: { type: 'field', value: 'country' },
          right: { type: 'string_value', value: 'Canada' },
        },
        right: {
          type: 'comparison_operator',
          value: 'gte',
          left: { type: 'field', value: 'age' },
          right: { type: 'number_value', value: 19 },
        },
      },
    });
  });

  test('it supports date/time formats', () => {
    const tokens = tokenize('createdAt gte 2023-01-01T00:00:00Z');
    const result = parse(tokens);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'gte',
      left: { type: 'field', value: 'createdAt' },
      right: { type: 'datetime_value', value: expect.any(Temporal.Instant) },
    });
    expect(result.right?.value?.toString()).toEqual('2023-01-01T00:00:00Z');
  });

  test('it supports date values', () => {
    const tokens = tokenize('createdAt gte 2023-01-01');
    const result = parse(tokens);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'gte',
      left: { type: 'field', value: 'createdAt' },
      right: { type: 'date_value', value: expect.any(Temporal.PlainDate) },
    });
    expect(result.right?.value?.toString()).toEqual('2023-01-01');
  });

  test('it supports time values', () => {
    const tokens = tokenize('createdAt gte 00:00:00');
    const result = parse(tokens);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'gte',
      left: { type: 'field', value: 'createdAt' },
      right: { type: 'time_value', value: expect.any(Temporal.PlainTime) },
    });
    expect(result.right?.value?.toString()).toEqual('00:00:00');
  });

  test('it supports duration values', () => {
    const tokens = tokenize('createdAt gte P1D');
    const result = parse(tokens);

    expect(result).toEqual({
      type: 'comparison_operator',
      value: 'gte',
      left: { type: 'field', value: 'createdAt' },
      right: { type: 'duration_value', value: expect.any(Temporal.Duration) },
    });
    expect(result.right?.value?.toString()).toEqual('P1D');
  });

  test('it throws an error for empty expressions', () => {
    const tokens = tokenize('()');
    const result = () => parse(tokens);

    expect(result).toThrow('Empty parentheses are not allowed.');
  });

  test('it supports nested groupings', () => {
    const tokens = tokenize('(((true eq true) and (false eq false)) or (true eq false))');
    const result = parse(tokens);

    expect(result).toEqual({
      type: 'logical_operator',
      value: 'or',
      left: {
        type: 'logical_operator',
        value: 'and',
        left: {
          type: 'comparison_operator',
          value: 'eq',
          left: { type: 'boolean_value', value: true },
          right: { type: 'boolean_value', value: true },
        },
        right: {
          type: 'comparison_operator',
          value: 'eq',
          left: { type: 'boolean_value', value: false },
          right: { type: 'boolean_value', value: false },
        },
      },
      right: {
        type: 'comparison_operator',
        value: 'eq',
        left: { type: 'boolean_value', value: true },
        right: { type: 'boolean_value', value: false },
      },
    });
  });
});
