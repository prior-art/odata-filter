import { describe, expect, test } from 'vitest';
import {
  appendFragment,
  clearBuilderState,
  createBuilderState,
  removeLastFragment,
  replaceBuilderState,
  serializeBuilder,
} from './model';

describe('builder model', () => {
  test('creates and serializes a comparison expression', () => {
    let state = createBuilderState();
    state = appendFragment(state, { type: 'field', value: 'age' });
    state = appendFragment(state, { type: 'comparison', value: 'gte' });
    state = appendFragment(state, { type: 'number', value: '21' });

    expect(serializeBuilder(state)).toBe("age gte 21");
  });

  test('quotes and escapes string literals', () => {
    const state = appendFragment(createBuilderState(), {
      type: 'string',
      value: "O'Brien",
    });

    expect(serializeBuilder(state)).toBe("'O''Brien'");
  });

  test('serializes parentheses and functions', () => {
    const state = {
      fragments: [
        { type: 'open', value: 'unexpected-open-value' },
        { type: 'field', value: 'name' },
        { type: 'comparison', value: 'eq' },
        { type: 'string', value: 'Ada' },
        { type: 'close', value: 'unexpected-close-value' },
      ] as const,
    };

    expect(serializeBuilder(state)).toBe("( name eq 'Ada' )");
  });

  test('serializes function and tuple fragments', () => {
    const state = {
      fragments: [
        { type: 'field', value: 'name' },
        { type: 'comparison', value: 'in' },
        { type: 'tuple', value: 'Ada, Grace' },
      ] as const,
    };

    expect(serializeBuilder(state)).toBe("name in ('Ada', 'Grace')");
  });

  test('serializes numeric tuple values and filters empty values', () => {
    const state = {
      fragments: [{ type: 'tuple', value: '1, -2.5, , O\'Brien' }],
    };

    expect(serializeBuilder(state)).toBe("(1, -2.5, 'O''Brien')");
    expect(serializeBuilder({
      fragments: [{ type: 'tuple', value: '42' }],
    })).toBe('(42)');
    expect(serializeBuilder({
      fragments: [{ type: 'tuple', value: '12.3456, -2.5x, 1e3' }],
    })).toBe("(12.3456, '-2.5x', '1e3')");
  });

  test('removes and clears fragments without mutating state', () => {
    const original = appendFragment(createBuilderState(), { type: 'field', value: 'name' });
    const removed = removeLastFragment(original);

    expect(original.fragments).toHaveLength(1);
    expect(removed.fragments).toHaveLength(0);
    expect(clearBuilderState()).toEqual(createBuilderState());
  });

  test('stores a typed text expression as a field fragment', () => {
    expect(replaceBuilderState('name eq ' + "'Ada'")).toEqual({
      fragments: [{ type: 'field', value: "name eq 'Ada'" }],
    });
    expect(replaceBuilderState('')).toEqual({ fragments: [] });
  });
});
