import { FilterQueryParserException } from './exceptions';
import { describe, it, expect, vi } from 'vitest';

describe('exceptions', () => {
  it('sets the prototype on the Error subclass', () => {
    const setPrototypeOf = vi.spyOn(Object, 'setPrototypeOf');

    try {
      const error = new FilterQueryParserException('Test error message');

      expect(setPrototypeOf).toHaveBeenCalledWith(
        error,
        FilterQueryParserException.prototype,
      );
      expect(error).toBeInstanceOf(FilterQueryParserException);
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('FilterQueryParserException');
    } finally {
      setPrototypeOf.mockRestore();
    }
  });
});
