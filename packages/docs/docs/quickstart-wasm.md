---
layout: default
title: Quickstart (WASM)
nav_order: 5
---

# Quickstart — WASM Runtime

`@odata-filter/core-wasm` is an AssemblyScript reimplementation of the core parser compiled to
WebAssembly. Use it in environments where a native WASM runtime provides a performance advantage,
or when you need to run the parser outside a standard Node.js context.

## 1. Install

```sh
npm i @odata-filter/core-wasm --save
```

## 2. Import (async)

AssemblyScript WASM modules are loaded asynchronously. Always `await` the import before calling
any exported function.

```ts
const { tokenize, parse } = await import('@odata-filter/core-wasm');
```

## 3. Tokenize a Filter Expression

```ts
const { tokenize } = await import('@odata-filter/core-wasm');

const tokens = tokenize("country/name eq 'US' and age gte 21");
console.log(tokens);
```

## 4. Parse into an AST

```ts
const { tokenize, parse } = await import('@odata-filter/core-wasm');

const tokens = tokenize("country/name eq 'US' and age gte 21");
const ast = parse(tokens);

console.log(JSON.stringify(ast, null, 2));
```

### AST Shape Differences from the TypeScript Core

Because AssemblyScript does not support union types, `Node.value` in the WASM output is a
**flattened struct** instead of a single typed value:

| Field | Description |
|-------|-------------|
| `format` | Numeric token format identifier |
| `raw` | Original token string |
| `stringValue` | String representation of the value |
| `intValue` | Integer representation (0 if not applicable) |
| `floatValue` | Float representation (0 if not applicable) |
| `boolValue` | Boolean representation (false if not applicable) |
| `arrayValue` | Array representation (empty if not applicable) |

Example output for `"country/name eq 'US' and age gte 21"`:

```json
{
  "type": 3,
  "value": {
    "format": 1,
    "raw": "and",
    "stringValue": "and",
    "intValue": 0,
    "floatValue": 0,
    "boolValue": false,
    "arrayValue": []
  },
  "left": {
    "type": 1,
    "value": {
      "format": 1,
      "raw": "eq",
      "stringValue": "eq",
      "intValue": 0,
      "floatValue": 0,
      "boolValue": false,
      "arrayValue": []
    },
    "left": {
      "type": 4,
      "value": {
        "format": 1,
        "raw": "country/name",
        "stringValue": "country/name",
        "intValue": 0,
        "floatValue": 0,
        "boolValue": false,
        "arrayValue": []
      },
      "left": null,
      "right": null
    },
    "right": {
      "type": 5,
      "value": {
        "format": 1,
        "raw": "'US'",
        "stringValue": "US",
        "intValue": 0,
        "floatValue": 0,
        "boolValue": false,
        "arrayValue": []
      },
      "left": null,
      "right": null
    }
  }
}
```

## 5. When to Choose WASM vs Node.js

| | Node.js (`@odata-filter/core`) | WASM (`@odata-filter/core-wasm`) |
|--|--|--|
| TypeScript-native | ✓ | |
| Typed union `Node.value` | ✓ | |
| Works in browser / edge runtimes | | ✓ |
| Compatible with `@odata-filter/validation` | ✓ | |
| Compatible with `@odata-filter/marshalers` | ✓ | |

## Next Steps

- [Quickstart (Node.js)]({% link docs/quickstart-nodejs.md %})
- [How-To Guides]({% link docs/how-to.md %})
- [FAQ]({% link docs/faq.md %})
