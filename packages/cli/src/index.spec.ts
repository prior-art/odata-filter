import util from 'util';
const { exec } = require('child_process');

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
  value: 'eq',
  left: { type: 'field', value: 'country' },
  right: { type: 'string_value', value: 'US' }
}

describe('index', () => {
  test('it processes cli invocations', () => {
    process.argv = ['', '', "country eq 'US'"];

    require('.');

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

  test('it accepts an optional schema file', () => {
    jest.mock('../schema.json', () => schema, {
      virtual: true,
    });

    process.argv = ['', '', "country eq 'US'", '-s', '../schema.json'];

    require('.');

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

  test('it accepts an optional format parameter', () => {
    process.argv = ['', '', "country eq 'US'", '-f', 'json'];

    require('.');

    baseExpectations();
    expect(console.log).toHaveBeenNthCalledWith(
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

  test('it fails when schema.json is empty', () => {
    jest.mock('../schema.json', () => "{}", {
      virtual: true,
    });

    process.argv = ['', '', "country eq 'US'", '-s', '../schema.json'];

    const result = () => require('.');

    expect(result).toThrow(
      "Invalid field country",
    );
  });
});
