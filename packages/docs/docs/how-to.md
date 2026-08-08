---
layout: default
title: How-To Guides
nav_order: 5
---

# How-To Guides

## Validate a Filter Against a JSON Schema

Use `@odata-filter/validation` to ensure that the fields and operators in a parsed filter are
consistent with your data model.

```sh
npm i @odata-filter/core @odata-filter/validation --save
```

```ts
import { tokenize, parse } from '@odata-filter/core';
import { validate } from '@odata-filter/validation';

const ast = parse(tokenize("age gte 21"));

validate(ast, {
  age: { type: 'number' },
});
// No error thrown.
```

If the filter references an unknown field or uses an operator incompatible with the field's type,
`validate` throws a descriptive error.

```ts
const ast = parse(tokenize("age gte 'twenty one'"));

validate(ast, {
  age: { type: 'number' },
});
// Error: Operator of type gte expects number_value, received string_value
```

## Convert a Filter to a MongoDB Query

Use `@odata-filter/marshalers` to transform a parsed AST into a MongoDB-compatible query object.

```sh
npm i @odata-filter/core @odata-filter/marshalers --save
```

```ts
import { tokenize, parse } from '@odata-filter/core';
import { toMongoJson } from '@odata-filter/marshalers';

const ast = parse(tokenize("country/name eq 'US' and age gte 21"));

console.log(toMongoJson(ast));
/*
{
  "$and": [
    { "country/name": { "$eq": "US" } },
    { "age": { "$gte": 21 } }
  ]
}
*/
```

## Convert a Filter to a SQL WHERE Clause

Use `@odata-filter/marshalers` to transform a parsed AST into a SQL `WHERE` clause string.

```sh
npm i @odata-filter/core @odata-filter/marshalers --save
```

```ts
import { tokenize, parse } from '@odata-filter/core';
import { toSqlWhere } from '@odata-filter/marshalers';

const ast = parse(tokenize("country eq 'US' and age gte 21"));

console.log(toSqlWhere(ast));
// "(country = 'US' AND age >= 21)"
```

String values are automatically escaped (single quotes are doubled), `null` is rendered as `NULL`,
booleans become `1`/`0`, and `contains()` is translated to `LIKE '%value%'`.

```ts
const ast2 = parse(tokenize("contains(description, 'free') and active eq true"));

console.log(toSqlWhere(ast2));
// "(description LIKE '%free%' AND active = 1)"
```

## Use the Fastify Plugin

The `@odata-filter/fastify` plugin automatically parses the `filter` query-string parameter on
every incoming request and attaches the parsed result to `request.query.filterParsed`.

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/fastify --save
```

### Basic Setup

```ts
import Fastify from 'fastify';
import { fastifyPlugin } from '@odata-filter/fastify';

const fastify = Fastify();

fastify.addSchema({
  $id: 'qs',
  type: 'object',
  properties: {
    country: { type: 'string' },
    age: { type: 'number' },
  },
});

fastify.register(async (instance) => {
  fastifyPlugin(instance, { schemaId: 'qs' });

  // GET /?filter=country+eq+%27US%27
  instance.get('/', async ({ query: { filter, filterParsed } }) => {
    console.log('Raw:', filter);       // "country eq 'US'"
    console.log('Parsed:', filterParsed);
    /*
    {
      type: 'comparison_operator',
      value: 'eq',
      left: { type: 'field', value: 'country' },
      right: { type: 'string_value', value: 'US' }
    }
    */
  });
});
```

### With MongoDB Marshaling

Pass `format: 'mongo-json'` to receive a MongoDB query object instead of the raw AST.

```ts
fastify.register(async (instance) => {
  fastifyPlugin(instance, { schemaId: 'qs', format: 'mongo-json' });

  // GET /?filter=country+eq+%27US%27
  instance.get('/', async ({ query: { filter, filterParsed } }) => {
    console.log('Raw:', filter);       // "country eq 'US'"
    console.log('Parsed:', filterParsed); // { country: 'US' }
  });
});
```

## Use the Express Middleware

The `@odata-filter/express` middleware automatically parses the `filter` query-string parameter on
every incoming request and attaches the parsed result to `req.query.filterParsed`.

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/express --save
```

### Basic Setup

```ts
import express from 'express';
import expressMiddleware from '@odata-filter/express';

const app = express();

const schema = {
  country: { type: 'string' },
  age: { type: 'number' },
};

app.use(expressMiddleware({ schema }));

// GET /?filter=country+eq+%27US%27
app.get('/', (req, res) => {
  const { filter, filterParsed } = req.query;
  console.log('Raw:', filter);       // "country eq 'US'"
  console.log('Parsed:', filterParsed);
  /*
  {
    type: 'comparison_operator',
    value: 'eq',
    left: { type: 'field', value: 'country' },
    right: { type: 'string_value', value: 'US' }
  }
  */
  res.send();
});
```

### With MongoDB Marshaling

Pass `format: 'mongo-json'` to receive a MongoDB query object instead of the raw AST.

```ts
app.use(expressMiddleware({ schema, format: 'mongo-json' }));

// GET /?filter=country+eq+%27US%27
app.get('/', (req, res) => {
  const { filter, filterParsed } = req.query;
  console.log('Raw:', filter);       // "country eq 'US'"
  console.log('Parsed:', filterParsed); // { country: 'US' }
  res.send();
});
```

### With SQL Marshaling

Pass `format: 'sql'` to receive a SQL `WHERE` clause string instead of the raw AST.

```ts
app.use(expressMiddleware({ schema, format: 'sql' }));

// GET /?filter=country+eq+%27US%27
app.get('/', (req, res) => {
  const { filter, filterParsed } = req.query;
  console.log('Raw:', filter);       // "country eq 'US'"
  console.log('Parsed:', filterParsed); // "(country = 'US')"
  res.send();
});
```

## Use the CLI for Local Testing

The CLI lets you test filter expressions against a local `schema.json` without writing any code.

```sh
npm run dev "country eq 'US' and age gte 21"
# or with just
just dev "country eq 'US' and age gte 21"
```

Create a `schema.json` file at the project root with the field definitions you want to test
against:

```json
{
  "country": { "type": "string" },
  "age": { "type": "number" }
}
```

Use `--format` to control the output format. The default is `ast`; `json` produces a MongoDB query
object; `sql` produces a SQL `WHERE` clause string:

```sh
npm run dev -- --format sql "country eq 'US' and age gte 21"
# SQL "(country = 'US' AND age >= 21)"
```

## Use `contains()` to Filter on Substrings

The `contains(field, 'value')` function checks whether a field's value contains the given
substring.

```ts
const ast = parse(tokenize("contains(description, 'free')"));
```

## Filter on Date and Time Values

All date/time values must be in ISO 8601 format. The library uses the
[Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
internally.

```ts
// Date
const ast = parse(tokenize("createdAt gt 2024-01-01"));

// DateTimeOffset
const ast2 = parse(tokenize("createdAt gt 2024-01-01T00:00:00Z"));

// Use now() to compare against the current date/time
const ast3 = parse(tokenize("createdAt gt now()"));
```
