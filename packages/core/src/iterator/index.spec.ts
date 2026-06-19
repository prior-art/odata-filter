import { iterate } from '..';
import { NodeType } from '../parser/types';

describe('#iterate', () => {
  test('it transforms the abstract syntax tree (AST) into an Array collection of nodes', () => {
    const astStub = {
      type: NodeType.LOGICAL_OPERATOR,
      value: 'or',
      left: {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'eq',
        left: { type: NodeType.FIELD, value: 'country' },
        right: { type: NodeType.STRING_LITERAL, value: 'US' },
      },
      right: {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'gte',
        left: { type: NodeType.FIELD, value: 'age' },
        right: { type: NodeType.NUMBER_LITERAL, value: 21 },
      },
    };

    const result = iterate(astStub);

    expect(result).toEqual([
      {
        type: 'logical_operator',
        value: 'or',
        left: {
          type: 'comparison_operator',
          value: 'eq',
          left: {
            type: 'field',
            value: 'country',
          },
          right: {
            type: 'string_value',
            value: 'US',
          },
        },
        right: {
          type: 'comparison_operator',
          value: 'gte',
          left: {
            type: 'field',
            value: 'age',
          },
          right: {
            type: 'number_value',
            value: 21,
          },
        },
      },
      {
        type: 'comparison_operator',
        value: 'eq',
        left: { type: 'field', value: 'country' },
        right: { type: 'string_value', value: 'US' },
      },
      { type: 'field', value: 'country' },
      { type: 'string_value', value: 'US' },
      {
        type: 'comparison_operator',
        value: 'gte',
        left: { type: 'field', value: 'age' },
        right: { type: 'number_value', value: 21 },
      },
      { type: 'field', value: 'age' },
      { type: 'number_value', value: 21 },
    ]);
  });
});
