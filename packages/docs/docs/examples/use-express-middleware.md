---
layout: default
title: Use the Express Middleware
parent: Examples
nav_order: 6
---

# Use the Express Middleware

The `@odata-filter/express` middleware automatically parses the `filter` query-string parameter on
every incoming request and attaches the parsed result to `req.query.filterParsed`.

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/express --save
```

## Basic Setup

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

## With MongoDB Marshaling

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

## With SQL Marshaling

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
