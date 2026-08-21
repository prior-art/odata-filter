import { JsonSchema, Comparison } from './types';
import { jsonTypeLookup } from './lookups';
import { ValidationException } from './exceptions';
import { NodeType } from '@odata-filter/core';

const resolveFieldName = (comparison: Comparison): string =>
  comparison.left.type === NodeType.UNARY_FUNCTION
    ? comparison.left.left.value
    : comparison.left.value;

export const assertValidField = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  if (!schema[fieldName]) {
    throw new ValidationException(`Invalid field ${fieldName}`);
  }
};

export const assertValidType = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { type } = comparison.right;
  const jsonType = jsonTypeLookup[type];
  const schemaField = schema[fieldName];

  const invalidType = 'type' in schemaField && schemaField.type !== jsonType;
  if (invalidType) {
    throw new ValidationException(
      `Invalid type for field ${fieldName}, expected ${schemaField.type}, received ${jsonType}`,
    );
  }
};

export const assertValidItemsType = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { type, value } = comparison.right;
  const schemaField = schema[fieldName];

  if (
    'items' in schemaField &&
    'type' in schemaField.items &&
    Array.isArray(value)
  ) {
    value.forEach((item) => {
      const invalidArrayTypes = typeof item !== schemaField.items.type;
      if (invalidArrayTypes) {
        throw new ValidationException(
          `Value ${value} expected type ${schemaField.items.type}, received ${typeof item}`,
        );
      }
    });
  }
};

export const assertValidConst = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { value } = comparison.right;
  const schemaField = schema[fieldName];

  const invalidConst = 'const' in schemaField && schemaField.const !== value;
  if (invalidConst) {
    throw new ValidationException(
      `Field ${fieldName} value must equal ${schemaField.const}`,
    );
  }
};

export const assertValidItemsConst = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { value } = comparison.right;
  const schemaField = schema[fieldName];

  if (
    'items' in schemaField &&
    Array.isArray(value)
  ) {
    value.forEach((item) => {
      if ('const' in schemaField.items) {
        const invalidConst = schemaField.items.const !== item;
        if (invalidConst) {
          throw new ValidationException(
            `Field ${fieldName} value must equal ${schemaField.items.const}`,
          );
        }
      }
    });
  }
};

export const assertValidEnum = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { value } = comparison.right;
  const schemaField = schema[fieldName];

  const invalidEnum =
    'enum' in schemaField && !schemaField.enum.includes(value);
  if (invalidEnum) {
    throw new ValidationException(
      `Field ${fieldName} value must be one of the following: ${schemaField.enum}`,
    );
  }
};

export const assertValidItemsEnum = (
  schema: JsonSchema,
  comparison: Comparison,
): void => {
  const fieldName = resolveFieldName(comparison);
  const { value } = comparison.right;
  const schemaField = schema[fieldName];

  if (
    'items' in schemaField &&
    Array.isArray(value)
  ) {
    value.forEach((item) => {
      if ('enum' in schemaField.items) {
        const invalidEnum = !(
          schemaField.items.enum as Array<string | number>
        ).includes(item);
        if (invalidEnum) {
          throw new ValidationException(
            `Field ${fieldName} value must equal ${schemaField.items.enum}`,
          );
        }
      }
    });
  }
};
