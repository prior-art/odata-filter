import { toMongoJson } from './index';
import type { Node } from '@prior-art/odata-filter-core';

describe('mongoJson', () => {
  test('it transforms an AST node into a JSON object', () => {
    // odata string: "country eq 'US' and user/age gte 21 or not (name in ('Hello', 'World') and grade lt 9 or state ne 'GA')"
    const astStub: Node = {
      type: 'logical_operator',
      value: 'and',
      left: {
        type: 'comparison_operator',
        value: 'eq',
        left: { type: 'field', value: 'country' },
        right: { type: 'string_value', value: 'US' },
      },
      right: {
        type: 'logical_operator',
        value: 'or',
        left: {
          type: 'comparison_operator',
          value: 'gte',
          left: { type: 'field', value: 'user/age' },
          right: { type: 'number_value', value: 21 },
        },
        right: {
          type: 'unary_operator',
          value: 'not',
          left: {
            type: 'logical_operator',
            value: 'and',
            left: {
              type: 'comparison_operator',
              value: 'in',
              left: { type: 'field', value: 'name' },
              right: { type: 'array', value: ['Hello', 'World'] },
            },
            right: {
              type: 'logical_operator',
              value: 'or',
              left: {
                type: 'comparison_operator',
                value: 'lt',
                left: { type: 'field', value: 'grade' },
                right: { type: 'number_value', value: 9 },
              },
              right: {
                type: 'comparison_operator',
                value: 'ne',
                left: { type: 'field', value: 'state' },
                right: { type: 'string_value', value: 'GA' },
              },
            },
          },
        },
      },
    } as Node;

    const result = toMongoJson(astStub);
    expect(result).toEqual({
      country: 'US',
      $or: [
        { 'user/age': { $gte: 21 } },
        {
          $not: {
            name: ['Hello', 'World'],
            $or: [{ grade: { $lt: 9 } }, { state: { $ne: 'GA' } }],
          },
        },
      ],
    });
  });

  test('it returns the given query parameters if no AST node is given', () => {
    const result = toMongoJson(undefined, { query: 'parameters' });
    expect(result).toEqual({ query: 'parameters' });
  });

  test('it returns the given query parameters if AST node is not a logical, comparison, or unary operator type', () => {
    const astStub: Node = {
      type: 'field',
      value: 'and',
    } as Node;
    const result = toMongoJson(astStub, { query: 'parameters' });
    expect(result).toEqual({ query: 'parameters' });
  });

  test('it only accepts the first occurrence of a field and ignores duplicate occurrences of a field', () => {
    const astStub: Node = {
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
        value: 'eq',
        left: { type: 'field', value: 'country' },
        right: { type: 'string_value', value: 'UK' },
      },
    } as Node;

    const result = toMongoJson(astStub);
    expect(result).toEqual({ country: 'US' });
  });

  test('it does not assess a comparison operator if the "field" value is empty', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: null },
      right: { type: 'string_value', value: 'US' },
    } as Node;

    const result = toMongoJson(astStub);
    expect(result).toEqual({});
  });

  test('it does not assess a comparison operator if the "left" or "right" field is missing', () => {
    let astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      right: { type: 'string_value', value: 'US' },
    } as Node;
    let result = toMongoJson(astStub);
    expect(result).toEqual({});

    astStub = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'string_value', value: 'US' },
    } as Node;
    result = toMongoJson(astStub);
    expect(result).toEqual({});
  });
});
