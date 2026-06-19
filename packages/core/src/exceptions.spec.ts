import { FilterQueryParserException } from './exceptions';

describe('exceptions', () => {
  it('should throw', () => {
    expect.hasAssertions();

    try {
      throw new FilterQueryParserException('Test error message');
    } catch (error) {
      expect(error).toBeInstanceOf(FilterQueryParserException);
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('FilterQueryParserException');
    }
  });
});
