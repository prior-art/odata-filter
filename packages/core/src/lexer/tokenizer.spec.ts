import { tokenize } from './tokenizer';
import { LexerException } from './exceptions';
import { FilterQueryParserException } from '../exceptions';
import { Temporal } from '@js-temporal/polyfill';

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
    const sourceStub = `${symbol} eq 'math'`;
    const result = tokenize(sourceStub);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: symbol,
        }),
      ]),
    );
  });

  test.each(["curriculum eq      'math'", "curriculum         eq 'math'"])(
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
            value: 'math',
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

  it.each([
    'temperature eq -21',
    'temperature eq +21',
    'temperature eq 21',
  ])('it supports signed integers', (sourceStub) => {
    const result = tokenize(sourceStub);

    expect(result).toEqual([
      { value: 'temperature', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 12 },
      { value: parseInt(sourceStub.split(' ')[2]), type: 'number', pos: 15 },
    ]);
  });

  it.each([
    '-21.50',
    '+21.50',
    '21.50',
    '-0.0001',
    '100.123456789',
    '1.7976931348623157E+308',
    '14.7e+3',
    Number.MAX_VALUE.toString(),
    '.01',
    '.0000000000000000000000000000000000000000000000000000000001',
    '1.23e-10',
    '5.67E-8',
    '9.10e+11',
    '3.14E0',
    '1.23e4',
    '5.67E-8',
    '9.10e+11',
    '3.14E0',
    '1.23e4',
    '5.67E-8',
    '9.10e+11',
    '3.14E0',
    '1.23e4',
    '6.022e23',
    '-1.6E-19',
    '3e8',
    '-3e8',
    '+4.5e12',
    '3.123e-4',
    '1.0e4',
    '0.01e+2',
    '.4',
    '6e23',
    '6e+23',
    '1e5',
  ])('it supports signed floats: %s', (floatValue) => {
    const result = tokenize(`rate eq ${floatValue}`);

    expect(result).toEqual([
      { value: 'rate', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 5 },
      { value: parseFloat(floatValue), type: 'number', pos: 8 },
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

  it.each([
    '2023-06-15',
    '2023-12-31',
    '2024-02-29',
  ])('it supports date format: %s', (dateValue) => {
    const result = tokenize(`date eq ${dateValue} and true eq true`);

    expect(result).toEqual([
      { value: 'date', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 5 },
      { value: expect.any(Temporal.PlainDate), type: 'date', pos: 8 },
      { value: 'and', type: 'and_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
      { value: 'eq', type: 'eq_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
    ]);
  });

  it.each([
    '2023-06-15T12:30:45Z',
    '2023-12-31T23:59:59Z',
    '2024-02-29T00:00:00Z',
    '2024-02-28T00:00:00+05:30',
    '2024-02-28T00:00:00-08:00',
  ])('it supports datetime format: %s', (datetimeValue) => {
    const result = tokenize(`datetime eq ${datetimeValue} and true eq true`);

    expect(result).toEqual([
      { value: 'datetime', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 9 },
      { value: expect.any(Temporal.Instant), type: 'datetime', pos: 12 },
      { value: 'and', type: 'and_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
      { value: 'eq', type: 'eq_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
    ]);
  });

  it.each([
    '2023-00-15T12:30:45.123456789Z',
  ])('it catches invalid datetime formats: %s', (invalidDatetime) => {
    expect.hasAssertions();

    try {
      const res = tokenize(`datetime eq ${invalidDatetime}`);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Invalid datetime format: ${invalidDatetime}`);
    }
  });

  it.each([
    '12:30:45',
    '23:59:59',
    '00:00:00',
    '01:02:03.123456789',
  ])('it supports time format: %s', (timeValue) => {
    const result = tokenize(`time eq ${timeValue} and true eq true`);

    expect(result).toEqual([
      { value: 'time', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 5 },
      { value: expect.any(Temporal.PlainTime), type: 'time', pos: 8 },
      { value: 'and', type: 'and_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
      { value: 'eq', type: 'eq_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
    ]);
  });

  it.each([
    '26:00:00',
    '12:60:00',
    '12:30:70',
    '24:00:00',
    '01:02:03.123456789123',
  ])('it throws an error for invalid time formats: %s', (invalidTime) => {
    expect.hasAssertions();

    try {
      const res = tokenize(`time eq ${invalidTime}`);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Invalid time format: ${invalidTime}`);
    }
  });

  it.each([
    '2023-12-00',
    '2023-13-01',
    '0000-00-00',
  ])('it throws an error for invalid date formats: %s', (invalidDate) => {
    expect.hasAssertions();

    try {
      const res = tokenize(`date eq ${invalidDate}`);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Invalid date format: ${invalidDate}`);
    }
  });

  it.each([
    ['2026-12-31T00:00:00.text', '-31T00:00:00.text'],
    ['2020-02-30T12:00:00', '-30T12:00:00'],
  ])('it throws an error for invalid datetime formats: %s', (invalidDatetime, invalidPart) => {
    expect.hasAssertions();

    try {
      const res = tokenize(`datetime eq ${invalidDatetime}`);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Unexpected token near ${invalidPart}`);
    }
  });

  it.each([
    'P10Y20M30DT40H50M60.70S',
    'P1Y',
    'P2M',
    'P3D',
    'PT4H',
    'PT5M',
    'PT6S',
    'PT6.7S',
  ])('it supports duration format: %s', (durationValue) => {
    const result = tokenize(`duration eq ${durationValue} and true eq true`);

    expect(result).toEqual([
      { value: 'duration', type: 'symbol', pos: 0 },
      { value: 'eq', type: 'eq_operator', pos: 9 },
      { value: expect.any(Temporal.Duration), type: 'duration', pos: 12 },
      { value: 'and', type: 'and_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
      { value: 'eq', type: 'eq_operator', pos: expect.any(Number) },
      { value: true, type: 'boolean_true', pos: expect.any(Number) },
    ]);
  });

  it.each([
    ['P0', 'P'],
  ])('it throws an error for invalid duration formats: %s', (invalidDuration, invalidPart) => {
    expect.hasAssertions();

    try {
      const res = tokenize(`duration eq ${invalidDuration}`);
    } catch (e) {
      expect(e).toBeInstanceOf(LexerException);
      expect(e).toBeInstanceOf(FilterQueryParserException);
      expect(e.name).toBe('LexerException');
      expect(e.message).toEqual(`Invalid duration format: ${invalidPart}`);
    }
  });
});
