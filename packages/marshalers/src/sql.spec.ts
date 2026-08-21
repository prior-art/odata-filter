import { toSqlWhere } from './index';
import type { Node } from '@odata-filter/core';

describe('sql', () => {
  test('it transforms an AST node into a SQL WHERE clause string', () => {
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

    const result = toSqlWhere(astStub);
    expect(result).toEqual(
      "(country = 'US' AND (user/age >= 21 OR NOT ((name IN ('Hello', 'World') AND (grade < 9 OR state != 'GA')))))",
    );
  });

  test('it returns an empty string if no AST node is given', () => {
    const result = toSqlWhere(undefined);
    expect(result).toEqual('');
  });

  test('it returns an empty string if AST node is not a logical, comparison, or unary operator type', () => {
    const astStub: Node = {
      type: 'field',
      value: 'country',
    } as Node;
    const result = toSqlWhere(astStub);
    expect(result).toEqual('');
  });

  test('it does not assess a comparison operator if the "field" value is empty', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: null },
      right: { type: 'string_value', value: 'US' },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual('');
  });

  test('it formats NULL values correctly', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'country' },
      right: { type: 'null', value: null },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual('country = NULL');
  });

  test('it formats boolean values correctly', () => {
    const trueStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'active' },
      right: { type: 'boolean_value', value: true },
    } as Node;

    expect(toSqlWhere(trueStub)).toEqual('active = 1');

    const falseStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'active' },
      right: { type: 'boolean_value', value: false },
    } as Node;

    expect(toSqlWhere(falseStub)).toEqual('active = 0');
  });

  test('it formats string values with escaped single quotes', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'name' },
      right: { type: 'string_value', value: "O'Brien" },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name = 'O''Brien'");
  });

  test('it formats contains operator as LIKE with % wildcards', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'contains',
      left: { type: 'field', value: 'name' },
      right: { type: 'string_value', value: 'Smith' },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name LIKE '%Smith%'");
  });

  test('it escapes single quotes in the contains operator value', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'contains',
      left: { type: 'field', value: 'name' },
      right: { type: 'string_value', value: "O'Brien" },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name LIKE '%O''Brien%'");
  });

  test('it formats startswith operator as LIKE with a trailing % wildcard', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'startswith',
      left: { type: 'field', value: 'name' },
      right: { type: 'string_value', value: 'Smith' },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name LIKE 'Smith%'");
  });

  test('it escapes single quotes in the startswith operator value', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'startswith',
      left: { type: 'field', value: 'name' },
      right: { type: 'string_value', value: "O'Brien" },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name LIKE 'O''Brien%'");
  });

  test('it coerces a non-string value to a string for the contains operator', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'contains',
      left: { type: 'field', value: 'code' },
      right: { type: 'number_value', value: 42 },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("code LIKE '%42%'");
  });

  test('it coerces a non-string value to a string for the startswith operator', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'startswith',
      left: { type: 'field', value: 'code' },
      right: { type: 'number_value', value: 42 },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("code LIKE '42%'");
  });

  test('it coerces a missing value to an empty string for the contains operator', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'contains',
      left: { type: 'field', value: 'name' },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("name LIKE '%%'");
  });

  test('it formats unary NOT operator', () => {
    const astStub: Node = {
      type: 'unary_operator',
      value: 'not',
      left: {
        type: 'comparison_operator',
        value: 'eq',
        left: { type: 'field', value: 'country' },
        right: { type: 'string_value', value: 'US' },
      },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("NOT (country = 'US')");
  });

  test('it formats a simple AND logical operator', () => {
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
        left: { type: 'field', value: 'active' },
        right: { type: 'boolean_value', value: true },
      },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("(country = 'US' AND active = 1)");
  });

  test('it formats a trim function as TRIM(field) = value', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: {
        type: 'unary_function',
        value: 'trim',
        left: { type: 'field', value: 'CompanyName' },
      },
      right: { type: 'string_value', value: 'Alfreds Futterkiste' },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual("TRIM(CompanyName) = 'Alfreds Futterkiste'");
  });

  test('it formats a trim function with a number comparison', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'gt',
      left: {
        type: 'unary_function',
        value: 'trim',
        left: { type: 'field', value: 'code' },
      },
      right: { type: 'number_value', value: 42 },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual('TRIM(code) > 42');
  });

  test('it formats a trim function with a missing right value as NULL', () => {
    const astStub: Node = {
      type: 'comparison_operator',
      value: 'eq',
      left: {
        type: 'unary_function',
        value: 'trim',
        left: { type: 'field', value: 'CompanyName' },
      },
    } as Node;

    const result = toSqlWhere(astStub);
    expect(result).toEqual('TRIM(CompanyName) = NULL');
  });
});

