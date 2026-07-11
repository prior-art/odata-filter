import util from 'util';
import { jest } from '@jest/globals';
import { exec } from 'child_process';

jest.spyOn(console, 'log');
jest.spyOn(console, 'warn');
jest.spyOn(console, 'time');
jest.spyOn(console, 'timeEnd');
jest.spyOn(util, 'inspect');

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

const schema = {
  country: {
    type: 'string',
  },
};

const baseExpectations = () => {
  expect(util.inspect).toHaveBeenNthCalledWith(1, expect.anything(), {
    depth: null,
    colors: true,
    showHidden: false,
  });
  expect(util.inspect).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledTimes(1);
};

const astStub = {
  type: 'comparison_operator',
  tokenType: 'eq_operator',
  value: 'eq',
  left: { type: 'field', tokenType: 'symbol', value: 'country' },
  right: { type: 'string_value', tokenType: 'string', value: 'US' }
}

describe('index', () => {
  test('it processes cli invocations', async () => {
    process.argv = ['', '', "country eq 'US'"];

    await import('.');

    baseExpectations();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      'AST',
      util.inspect(astStub, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  test.skip('it accepts an optional schema file', async () => {
    expect.assertions(3);
    jest.mock('../schema.json', () => schema, {
      virtual: true,
    });

    process.argv = ['', '', "country eq 'US'", '-s', '../schema.json'];

    try {
      await import('.');
    } catch (error) {
      baseExpectations();
      expect(console.log).toHaveBeenNthCalledWith(
        1,
        'AST',
        util.inspect(astStub, {
          depth: null,
          colors: true,
          showHidden: false,
        }),
        '\n',
      );
    }
  });

  test('it accepts an optional format parameter', async () => {
    process.argv = ['', '', "country eq 'US'", '-f', 'json'];

    await import('.');

    baseExpectations();
    await expect(console.log).toHaveBeenNthCalledWith(
      1,
      'JSON',
      util.inspect({ country: 'US' }, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  test('it fails when schema.json is empty', async () => {
    jest.mock('../schema.json', () => "{}", {
      virtual: true,
    });

    process.argv = ['', '', "country eq 'US'", '-s', '../schema.json'];

    const result = async () => await import('.');

    await expect(result).toThrow(
      "Invalid field country",
    );
  });
});
