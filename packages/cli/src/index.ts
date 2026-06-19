#!/usr/bin/env node

import { program, Option } from 'commander';
import { inspect } from 'util';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { toMongoJson } from '@odata-filter/marshalers';
import { name, description, version } from '../package.json';

program.name(name).description(description).version(version);

// Stryker disable next-line StringLiteral: The mutant effects documentation only
program.argument('<filter>', 'OData filter query string');

// Stryker disable next-line StringLiteral: The mutant effects documentation only
program.option('-s, --schema <string>', 'path to schema json file');

// Stryker disable StringLiteral: The mutant effects documentation only
program.addOption(
    new Option('-f, --format <type>', 'output format')
      .choices(['ast', 'json'])
      .default('ast', 'output as AST'),
  );

program.action((filter, { schema, format }) => {
  const schemaSpec = schema ? require(schema) : null;
  const tokens = tokenize(filter);
  const ast = parse(tokens);

  if (schemaSpec) {
    validate(ast, schemaSpec as JsonSchema);
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
