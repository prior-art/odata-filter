---
layout: default
title: Use the NestJS Interceptor
parent: Examples
nav_order: 5
---

# Use the NestJS Interceptor

The `@odata-filter/nestjs` interceptor automatically parses the `filter` query-string parameter on
every incoming request and attaches the parsed result to `request.query.filterParsed`.

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/nestjs --save
```

## Basic Setup

```ts
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ODataFilterInterceptor } from '@odata-filter/nestjs';

const schema = {
  country: { type: 'string' },
  age: { type: 'number' },
};

@Controller()
export class AppController {
  @Get('/')
  @UseInterceptors(new ODataFilterInterceptor({ schema }))
  getRoot(@Query() query) {
    const { filter, filterParsed } = query;
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
    return filterParsed;
  }
}
```

## With MongoDB Marshaling

Pass `format: 'mongo-json'` to receive a MongoDB query object instead of the raw AST.

```ts
@Get('/')
@UseInterceptors(new ODataFilterInterceptor({ schema, format: 'mongo-json' }))
getRoot(@Query() query) {
  const { filter, filterParsed } = query;
  console.log('Raw:', filter);       // "country eq 'US'"
  console.log('Parsed:', filterParsed); // { country: 'US' }
  return filterParsed;
}
```

## With SQL Marshaling

Pass `format: 'sql'` to receive a SQL `WHERE` clause string instead of the raw AST.

```ts
@Get('/')
@UseInterceptors(new ODataFilterInterceptor({ schema, format: 'sql' }))
getRoot(@Query() query) {
  const { filter, filterParsed } = query;
  console.log('Raw:', filter);       // "country eq 'US'"
  console.log('Parsed:', filterParsed); // "country = 'US'"
  return filterParsed;
}
```
