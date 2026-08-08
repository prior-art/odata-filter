---
layout: default
title: Convert a Filter to a MongoDB Query
parent: Examples
nav_order: 2
---

# Convert a Filter to a MongoDB Query

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
