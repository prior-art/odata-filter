---
layout: default
title: Convert a Filter to a SQL WHERE Clause
parent: Examples
nav_order: 3
---

# Convert a Filter to a SQL WHERE Clause

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
booleans become `1`/`0`, `contains()` is translated to `LIKE '%value%'`, and `startswith()` is
translated to `LIKE 'value%'`.

```ts
const ast2 = parse(tokenize("contains(description, 'free') and active eq true"));

console.log(toSqlWhere(ast2));
// "(description LIKE '%free%' AND active = 1)"
```
