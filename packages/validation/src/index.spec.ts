import { validate } from '.';
import { NodeType, FilterQueryParserException } from '@odata-filter/core';
import { JsonSchema } from './types';
import { ValidationException } from './exceptions';

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

describe('#validate', () => {
  test('it throws an exception when field validation fails', () => {
    expect.hasAssertions();

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'string',
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e.message).toEqual('Invalid field age');
    }
  });

  test('it throws an exception when number type validation fails', () => {
    expect.hasAssertions();

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'string',
      },
      age: {
        type: 'integer',
      },
    };

    try {
      validate(
        {
          ...astStub,
          left: {
            ...astStub.left,
            right: {
              type: NodeType.NUMBER_LITERAL,
              value: 21,
            },
          },
        },
        jsonSchemaStub,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual(
        'Invalid type for field country, expected string, received number',
      );
    }
  });

  test('it throws an exception when boolean type validation fails', () => {
    expect.hasAssertions();

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'string',
      },
      age: {
        type: 'integer',
      },
    };

    try {
      validate(
        {
          ...astStub,
          right: {
            ...astStub.right,
            right: {
              type: NodeType.BOOLEAN_LITERAL,
              value: false,
            },
          },
        },
        jsonSchemaStub,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual(
        'Invalid type for field age, expected integer, received boolean',
      );
    }
  });

  test('it throws an exception when enum validation fails', () => {
    expect.hasAssertions();

    const jsonSchemaStub: JsonSchema = {
      country: {
        enum: ['Mexico', 'Argentina'],
      },
      age: {
        type: 'integer',
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual(
        'Field country value must be one of the following: Mexico,Argentina',
      );
    }
  });

  test('it throws an exception when const validation fails', () => {
    expect.hasAssertions();

    const jsonSchemaStub: JsonSchema = {
      country: {
        const: 'Mexico',
      },
      age: {
        type: 'integer',
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual('Field country value must equal Mexico');
    }
  });

  test('it throws an exception when array const validation fails', () => {
    expect.hasAssertions();

    const astStub = {
      type: NodeType.COMPARISON_OPERATOR,
      value: 'in',
      left: { type: NodeType.FIELD, value: 'country' },
      right: { type: NodeType.ARRAY, value: ['Mexico', 'Canada'] },
    };

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'array',
        items: {
          const: 'US',
        },
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual('Field country value must equal US');
    }
  });

  test('it throws an exception when array enum validation fails', () => {
    expect.hasAssertions();

    const astStub = {
      type: NodeType.COMPARISON_OPERATOR,
      value: 'in',
      left: { type: NodeType.FIELD, value: 'country' },
      right: { type: NodeType.ARRAY, value: ['United States'] },
    };

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'array',
        items: {
          enum: ['US', 'Canada', 'Mexico'],
        },
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual(
        'Field country value must equal US,Canada,Mexico',
      );
    }
  });

  test('it throws an exception when array type validation fails', () => {
    expect.hasAssertions();

    const astStub = {
      type: NodeType.COMPARISON_OPERATOR,
      value: 'in',
      left: { type: NodeType.FIELD, value: 'country' },
      right: { type: NodeType.ARRAY, value: [1, 2, 3] },
    };

    const jsonSchemaStub: JsonSchema = {
      country: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    };

    try {
      validate(astStub, jsonSchemaStub);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.name).toEqual('ValidationException');
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.message).toEqual(
        'Value 1,2,3 expected type string, received number',
      );
    }
  });

  test.each([
    [
      {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'eq',
        left: { type: NodeType.FIELD, value: 'country' },
        right: { type: NodeType.ARRAY, value: ['US'] },
      },
      {
        country: {
          items: {
            enum: ['US'],
          },
        },
      },
    ],
    [
      {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'eq',
        left: { type: NodeType.FIELD, value: 'country' },
        right: { type: NodeType.ARRAY, value: ['US'] },
      },
      {
        country: {
          items: {
            const: 'US',
          },
        },
      },
    ],
    [
      {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'eq',
        left: { type: NodeType.FIELD, value: 'country' },
        right: { type: NodeType.STRING_LITERAL, value: 'US' },
      },
      {
        country: {
          const: 'US',
        },
      },
    ],
    [
      {
        type: NodeType.COMPARISON_OPERATOR,
        value: 'in',
        left: { type: NodeType.FIELD, value: 'country' },
        right: { type: NodeType.ARRAY, value: ['US', 'Canada'] },
      },
      {
        country: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      } as JsonSchema,
    ],
  ])(
    'it does not throw an exception when validation passes',
    (astStub, jsonSchemaStub) => {
      const result = () => validate(astStub, jsonSchemaStub);

      expect(result).not.toThrow(ValidationException);
    },
  );
});
