import { FilterQueryParserException } from '.';

describe('index', () => {
  describe('FilterQueryParserException', () => {
    it('extends the Error class', () => {
      const result = () => {
        throw new FilterQueryParserException();
      };

      expect(result).toThrow(Error);
    });
  });
});
