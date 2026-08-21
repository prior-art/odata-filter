---
layout: default
title: Quickstart (Node.js)
nav_order: 4
---

# Quickstart — Node.js Runtime

Get up and running with `@odata-filter/core` in a Node.js project in under five minutes.

## 1. Install

```sh
npm i @odata-filter/core --save
```

## 2. Tokenize a Filter Expression

```ts
import { tokenize } from '@odata-filter/core';

const tokens = tokenize("country/name eq 'US' and age gte 21");
console.log(tokens);
```

`tokenize` returns a flat array of typed `Token` objects representing each element of the filter
string.

## 3. Parse into an AST

```ts
import { tokenize, parse } from '@odata-filter/core';

const tokens = tokenize("country/name eq 'US' and age gte 21");
const ast = parse(tokens);

console.log(JSON.stringify(ast, null, 2));
/*
{
  "type": "logical_operator",
  "value": "and",
  "left": {
    "type": "comparison_operator",
    "value": "eq",
    "left": { "type": "field", "value": "country/name" },
    "right": { "type": "string_value", "value": "US" }
  },
  "right": {
    "type": "comparison_operator",
    "value": "gte",
    "left": { "type": "field", "value": "age" },
    "right": { "type": "number_value", "value": 21 }
  }
}
*/
```

`parse` returns a tree of `Node` objects. Each node has a `type`, a `value`, and optional `left`
and `right` children for binary operators.

## 4. Traverse the AST

Use `iterate` to perform a depth-first walk over the tree and receive every node in order.

```ts
import { tokenize, parse, iterate } from '@odata-filter/core';

const tokens = tokenize("country eq 'US' and age gte 21");
const ast = parse(tokens);
const nodes = iterate(ast);

nodes.forEach(node => console.log(node.type, node.value));
```

## 5. Validate Against a JSON Schema

```ts
import { tokenize, parse } from '@odata-filter/core';
import { validate } from '@odata-filter/validation';

const ast = parse(tokenize("age gte 21"));

validate(ast, {
  age: { type: 'number' },
});
// No error thrown — the field type matches the operator.
```

## 6. Convert to a MongoDB Query

```ts
import { tokenize, parse } from '@odata-filter/core';
import { toMongoJson } from '@odata-filter/marshalers';

const ast = parse(tokenize("country eq 'US' and age gte 21"));

console.log(toMongoJson(ast));
/*
{
  "$and": [
    { "country": { "$eq": "US" } },
    { "age": { "$gte": 21 } }
  ]
}
*/
```

## Next Steps

- [Quickstart (WASM)]({% link docs/quickstart-wasm.md %})
- [How-To Guides]({% link docs/how-to.md %})
- [FAQ]({% link docs/faq.md %})
