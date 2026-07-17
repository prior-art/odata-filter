import util from 'util';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createCommand } from './cli.js';
import packageJson from '../package.json' assert { type: 'json' };

vi.spyOn(console, 'log');
vi.spyOn(console, 'warn');
vi.spyOn(console, 'time');
vi.spyOn(console, 'timeEnd');
vi.spyOn(util, 'inspect');

beforeEach(() => {
  vi.clearAllMocks();
});

const schema = {
  country: {
    type: 'string',
  },
};

describe('cli', () => {
  const astStub = {
    type: 'comparison_operator',
    value: 'lt',
    left: { type: 'field', value: 'price' },
    right: { type: 'number_value', value: 10 }
  }

  test('it processes cli invocations', async () => {
    const program = createCommand().exitOverride()
    const result = await program.parseAsync(['', '', "price lt 10"]);

    const filterArg = result.registeredArguments.find((arg: any) => arg.name() === 'filter');
    expect(filterArg.required).toEqual(true);
    expect(filterArg.variadic).toEqual(false);
    expect(filterArg.description).toEqual('OData filter query string');

    const runtimeOpt = result.options.find((opt: any) => opt.long === '--runtime');
    expect(runtimeOpt.flags).toEqual('-r, --runtime <type>');
    expect(runtimeOpt.defaultValue).toEqual('node');
    expect(runtimeOpt.defaultValueDescription).toEqual('use Node.js runtime');
    expect(runtimeOpt.description).toEqual('Runtime to use');
    expect(runtimeOpt.argChoices).toEqual(['node', 'wasm']);

    const formatOpt = result.options.find((opt: any) => opt.long === '--format');
    expect(formatOpt.flags).toEqual('-f, --format <type>');
    expect(formatOpt.defaultValue).toEqual('ast');
    expect(formatOpt.defaultValueDescription).toEqual('output as AST');
    expect(formatOpt.description).toEqual('output format');
    expect(formatOpt.argChoices).toEqual(['ast', 'json']);

    const schemaOpt = result.options.find((opt: any) => opt.long === '--schema');
    expect(schemaOpt.flags).toEqual('-s, --schema <string>');
    expect(schemaOpt.defaultValue).toBeUndefined();
    expect(schemaOpt.description).toEqual('path to schema json file');

    expect(result.version()).toEqual(packageJson.version);
    expect(result.name()).toEqual(packageJson.name);
    expect(result.description()).toEqual(packageJson.description);
    expect(console.log).toHaveBeenCalledWith(
      'AST',
      util.inspect(astStub, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  test('it provides a WASM runtime option', async () => {
    const wasmAstStub = {
      type: 1,
      value: {
        format: 1,
        raw: 'lt',
        stringValue: 'lt',
        intValue: 0,
        floatValue: 0,
        boolValue: false,
        arrayValue: []
      },
      left: {
        type: 4,
        value: {
          format: 1,
          raw: 'price',
          stringValue: 'price',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      },
      right: {
        type: 6,
        value: {
          format: 2,
          raw: '10',
          stringValue: '',
          intValue: 10,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      }
    }

    const program = createCommand().exitOverride()
    const result = await program.parseAsync(['', '', "price lt 10", '-r', 'wasm']);

    expect(console.log).toHaveBeenCalledWith(
      'AST',
      util.inspect(wasmAstStub, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  test('it fails when WASM runtime is used with JSON output format', async () => {
    const program = createCommand().exitOverride()
    const result = async () => await program.parseAsync(['', '', "price lt 10", '-r', 'wasm', '-f', 'json']);

    await expect(result()).rejects.toThrow('WASM runtime does not currently support JSON output format');
  });

  test('it fails when WASM runtime is used with schema validation', async () => {
    const program = createCommand().exitOverride()
    const result = async () => await program.parseAsync(['', '', "price lt 10", '-r', 'wasm', '-s', './schema.spec.json']);

    await expect(result()).rejects.toThrow('WASM runtime does not currently support schema validation');
  });

  test('it accepts an optional schema file', async () => {
    const program = createCommand().exitOverride()
    const result = async () => await program.parseAsync(['', '', "price lt 10 and color eq 'blue'", '-s', './schema.spec.json']);

    await expect(result()).rejects.toThrow('Invalid field color');
  });

  test('it accepts an optional format parameter', async () => {
    const jsonStub = {
      price: {
        $lt: 10
      }
    }
    const program = createCommand().exitOverride()
    const result = await program.parseAsync(['', '', "price lt 10", '-f', 'json']);

    expect(console.log).toHaveBeenCalledWith(
      'JSON',
      util.inspect(jsonStub, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  test('it fails when schema.json is empty', async () => {
    const program = createCommand().exitOverride();

    const result = async () => await program.parseAsync(['', '', "price lt 10", '-s', './schema.empty.spec.json']);
    await expect(result()).rejects.toThrow('Invalid field price');
  });
});
