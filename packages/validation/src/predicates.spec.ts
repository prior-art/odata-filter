import { isComparison } from './predicates';
import { NodeType } from '@prior-art/odata-filter-core';
import { ValidationException } from './exceptions';

describe('#isComparison', () => {
  test('it returns true when an ast node is a comparison', () => {
    const astStub = {
      type: NodeType.COMPARISON_OPERATOR,
      value: 'eq',
      left: {
        type: NodeType.FIELD,
        value: 'country',
      },
      right: {
        type: NodeType.STRING_LITERAL,
        value: 'US',
      },
    };

    const result = isComparison(astStub);

    expect(result).toEqual(true);
  });

  test('it returns false when an ast node is not a comparison', () => {
    const astStub = {
      type: NodeType.LOGICAL_OPERATOR,
    };
    const result = isComparison(astStub);

    expect(result).toEqual(false);
  });

  test.each([
    { type: NodeType.COMPARISON_OPERATOR },
    {
      type: NodeType.COMPARISON_OPERATOR,
      left: {
        type: NodeType.FIELD,
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      left: {
        type: NodeType.FIELD,
        value: 'country',
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      left: {
        value: 'country',
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      right: {
        type: NodeType.FIELD,
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      right: {
        value: 'US',
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      right: {
        type: NodeType.FIELD,
        value: 'US',
      },
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      left: {},
    },
    {
      type: NodeType.COMPARISON_OPERATOR,
      right: {},
    },
  ])('it throws an exception when the data is corrupt', (astStub) => {
    const result = () => isComparison(astStub);

    expect(result).toThrow(ValidationException);
    expect(result).toThrow('Invalid comparison');
  });
});
