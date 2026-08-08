---
layout: default
title: Validate a Filter Against a JSON Schema
parent: Examples
nav_order: 1
---

# Validate a Filter Against a JSON Schema

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
