---
layout: default
title: Use the Fastify Plugin
parent: Examples
nav_order: 4
---

# Use the Fastify Plugin

The `@odata-filter/fastify` plugin automatically parses the `filter` query-string parameter on
every incoming request and attaches the parsed result to `request.query.filterParsed`.

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/fastify --save
```

## Basic Setup

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

## With MongoDB Marshaling

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
