import { Command, Option } from '@commander-js/extra-typings';
import { inspect } from 'util';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { toMongoJson } from '@odata-filter/marshalers';
import packageJson from '../package.json' with { type: 'json' };

const nodeRuntime = (filter: string) => {
  const tokens = tokenize(filter);
  return parse(tokens);
};

const wasmRuntime = async (filter: string) => {
  const { tokenize, parse } = await import('@odata-filter/core-wasm');
  const tokens = tokenize(filter);

  return parse(tokens);
}

const runtimeMap: Record<string, Function> = {
  node: nodeRuntime,
  wasm: await wasmRuntime,
};

const validateOptions = (runtime?: string, format?: string, schema?: string) => {
  if (runtime && runtime === 'node') return;

  if (format && format === 'json') {
    throw new Error('WASM runtime does not currently support JSON output format');
  }

  if (schema) {
    throw new Error('WASM runtime does not currently support schema validation');
  }
};

export const createCommand = () => {
  const program = new Command()
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .argument('<filter>', 'OData filter query string')
  .addOption(
    new Option('-r, --runtime <type>', 'Runtime to use')
    .choices(['node', 'wasm'])
    .default('node', 'use Node.js runtime'),
  )
  .option('-s, --schema <string>', 'path to schema json file')
  .addOption(
    new Option('-f, --format <type>', 'output format')
    .choices(['ast', 'json'])
    .default('ast', 'output as AST')
  )
  .action(async (filter, { schema, format, runtime }) => {
    validateOptions(runtime?.toString(), format?.toString(), schema?.toString());

    const ast = await runtimeMap[runtime.toString()](filter);

    const schemaSpec = schema ? await import(schema.toString()) : null;
    if (schemaSpec) {
      validate(ast, schemaSpec as unknown as JsonSchema);
    }
    const formatting = format === "json" ? toMongoJson(ast) : ast;

    console.log(
      format.toString().toUpperCase(),
      inspect(formatting, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
      '\n',
    );
  });

  return program
}
