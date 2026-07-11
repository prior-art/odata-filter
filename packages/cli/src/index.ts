#!/usr/bin/env node

import { program, Option } from 'commander';
import { inspect } from 'util';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { toMongoJson } from '@odata-filter/marshalers';
import packageJson from '../package.json' with { type: 'json' };

const nodeRuntime = (filter: string): any => {
  const tokens = tokenize(filter);
  return parse(tokens);
};

const wasmRuntime = async (filter: string): Promise<any> => {
  const { tokenize, parse } = await import('@odata-filter/core-wasm');
  const tokens = tokenize(filter);

  return parse(tokens);
}

const runtimeMap: Record<string, Function> = {
  node: nodeRuntime,
  wasm: await wasmRuntime,
};

program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

// Stryker disable next-line StringLiteral: The mutant effects documentation only
program.argument('<filter>', 'OData filter query string');
//
// Stryker disable StringLiteral: The mutant effects documentation only
program.addOption(
  new Option('-r, --runtime <type>', 'Runtime to use')
    .choices(['node', 'wasm'])
    .default('node', 'use Node.js runtime'),
);

// Stryker disable next-line StringLiteral: The mutant effects documentation only
program.option('-s, --schema <string>', 'path to schema json file');

// Stryker disable StringLiteral: The mutant effects documentation only
program.addOption(
    new Option('-f, --format <type>', 'output format')
      .choices(['ast', 'json'])
      .default('ast', 'output as AST')
  );

const validateOptions = (options: any) => {
  if (options.runtime === 'node') return;

  if (options.format === 'json') {
    throw new Error('WASM runtime does not currently support JSON output format');
  }

  if (options.schema) {
    throw new Error('WASM runtime does not currently support schema validation');
  }
};

program.action(async (filter, options) => {
  validateOptions(options);

  const { schema, format, runtime } = options;

  const ast = await runtimeMap[runtime](filter);

  const schemaSpec = schema ? import(schema) : null;
  if (schemaSpec) {
    validate(ast, schemaSpec as unknown as JsonSchema);
  }
  const formatting = format === "json" ? toMongoJson(ast) : ast;

  console.log(
    format.toUpperCase(),
    inspect(formatting, {
      depth: null,
      colors: true,
      showHidden: false,
    }),
    '\n',
  );
});

program.parse();
