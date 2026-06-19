import { tokenize } from './tokenizer';
import { LexerException } from './exceptions';
import { FilterQueryParserException } from '../exceptions';

describe('#tokenizer', () => {
  test('it transforms a string of syntax into tokens', () => {
    const sourceStub =
      "(country eq 'US' and age gte 21) or (country eq 'Canada' and age gte 19)";
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: '(', type: 'open_paren', pos: 0 },
      { value: 'country', type: 'symbol', pos: 1 },
      { value: 'eq', type: 'eq_operator', pos: 9 },
      { value: 'US', type: 'string', pos: 12 },
      { value: 'and', type: 'and_operator', pos: 17 },
      { value: 'age', type: 'symbol', pos: 21 },
      { value: 'gte', type: 'gte_operator', pos: 25 },
      { value: 21, type: 'number', pos: 29 },
      { value: ')', type: 'close_paren', pos: 31 },
      { value: 'or', type: 'or_operator', pos: 33 },
      { value: '(', type: 'open_paren', pos: 36 },
      { value: 'country', type: 'symbol', pos: 37 },
      { value: 'eq', type: 'eq_operator', pos: 45 },
      { value: 'Canada', type: 'string', pos: 48 },
      { value: 'and', type: 'and_operator', pos: 57 },
      { value: 'age', type: 'symbol', pos: 61 },
      { value: 'gte', type: 'gte_operator', pos: 65 },
      { value: 19, type: 'number', pos: 69 },
      { value: ')', type: 'close_paren', pos: 71 },
    ]);
  });

  test.each([
    'country/name',
    'countryName',
    'country/name/abbrev',
    '_countryName',
    'country_name',
    'country__name',
    'countryName_',
    'countryName__',
  ])('symbols support slashes and underscores', (symbol) => {
    const sourceStub = `${symbol} eq 'EM2'`;
    const result = tokenize(sourceStub);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: symbol,
        }),
      ]),
    );
  });

  test.each(["curriculum eq      'EM2'", "curriculum         eq 'EM2'"])(
    'it supports multiple spaces',
    (sourceStub) => {
      const result = tokenize(sourceStub);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            value: 'curriculum',
          }),
          expect.objectContaining({
            value: 'eq',
          }),
          expect.objectContaining({
            value: 'EM2',
          }),
        ]),
      );
    },
  );

  test('it observes apostrophes in string values', () => {
    const sourceStub = "name eq 'O\\'Neal'";
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'name', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 5 },
      { value: "O'Neal", type: 'string', pos: 8 },
    ]);
  });

  test("it casts a string of 'null' to a null value", () => {
    const sourceStub = 'testing eq null';
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'testing', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 8 },
      { value: null, type: 'null', pos: 11 },
    ]);
  });

  test("it casts 'true' strings to a boolean", () => {
    const sourceStub = 'testing eq true';
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'testing', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 8 },
      { value: true, type: 'boolean_true', pos: 11 },
    ]);
  });

  test("it casts 'false' strings to a boolean", () => {
    const sourceStub = 'testing eq false';
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'testing', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 8 },
      { value: false, type: 'boolean_false', pos: 11 },
    ]);
  });

  test('it casts tuples of strings to an array of string', () => {
    const sourceStub = "country in ('US', 'Canada')";
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'country', type: 'symbol', pos: 0 },
      { value: 'in', type: 'in_operator', pos: 8 },
      { value: ['US', 'Canada'], type: 'tuple', pos: 11 },
    ]);
  });

  test('it casts tuples of numbers to an array of numbers', () => {
    const sourceStub = 'country in (19, 21)';
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'country', type: 'symbol', pos: 0 },
      { value: 'in', type: 'in_operator', pos: 8 },
      { value: [19, 21], type: 'tuple', pos: 11 },
    ]);
  });

  test.each([
    ["name eq 'O'Neal'", "'"],
    ['something;', ';'],
    ["country//name eq 'US'", "//name eq 'US'"],
    ["/name eq 'Sam'", "/name eq 'Sam'"],
    ["name/ eq 'Sam'", "/ eq 'Sam'"],
    ['2uesday eq false', '2uesday eq false'],
  ])('it guards against invalid syntax', (sourceStub, invalidSyntax) => {
    expect.hasAssertions();

    try {
      tokenize(sourceStub);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Unexpected token near ${invalidSyntax}`);
    }
  });
});
