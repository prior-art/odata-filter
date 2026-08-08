---
layout: default
title: FAQ
nav_order: 6
---

# Frequently Asked Questions

## General

### What is OData Filter?

OData Filter is a set of Node.js packages that parse OData v4 `$filter` query-string expressions
into a typed Abstract Syntax Tree (AST). You can then validate, transform, or forward that AST to
a data store.

### Which OData v4 features are supported?

The following data types are supported: Boolean, Decimal, Double, Guid, Int16, Int32, Int64,
Single, String, Date, DateTimeOffset, TimeOfDay, Duration.

The following functions are supported: `now()`, `contains(fieldName, 'value')`,
`startswith(fieldName, 'value')`.

The following features are **not** currently supported:
- the `has` operator
- arithmetic operators
- parameter aliasing

### Which package should I use?

Use `@odata-filter/core` for a standard Node.js environment. Use `@odata-filter/core-wasm` if you
need to run the parser in a browser, an edge runtime, or any environment where WebAssembly is
preferred. The WASM package has a slightly different AST shape — see
[Quickstart (WASM)]({% link docs/quickstart-wasm.md %}) for details.

### Can I use the Fastify plugin with other HTTP frameworks?

The `@odata-filter/fastify` package is specifically a Fastify plugin. Use `@odata-filter/express`
for Express applications or `@odata-filter/nestjs` for NestJS applications — both offer the same
`format` options (`mongo-json`, `sql`) as the Fastify plugin. For any other framework, use
`@odata-filter/core` and `@odata-filter/validation` directly to parse and validate the filter
string from the query parameter.

## Parsing

### What does `tokenize` return?

`tokenize` returns a flat array of `Token` objects. Each token has a `type` (e.g. `field`,
`string_value`, `eq`) and a `value`. Pass this array to `parse` to build the AST.

### What does `parse` return?

`parse` returns a `Node` object representing the root of the Abstract Syntax Tree. Each `Node`
has `type`, `value`, and optional `left`/`right` children for binary operators.

### Why is the WASM AST shape different from the TypeScript core?

AssemblyScript (the language used to write the WASM module) does not support TypeScript union
types. The `Node.value` field is therefore a flattened struct with separate fields for each
possible value kind (`stringValue`, `intValue`, `floatValue`, `boolValue`, `arrayValue`).

### Can I traverse the full AST?

Yes. Use `iterate` from `@odata-filter/core` to receive every node in depth-first order as a flat
array.

## Validation

### What happens when validation fails?

`validate` throws an `Error` with a descriptive message, for example:
`"Operator of type gte expects number_value, received string_value"`.

### Does `validate` modify the AST?

No. `validate` is a read-only check and never mutates the AST.

## Marshalers

### Which output formats are supported?

Currently `toMongoJson` (MongoDB query object format compatible with MikroORM) and `toSqlWhere`
(SQL `WHERE` clause string) are provided.

### Can I add a custom marshaler?

Yes. A marshaler is any function that accepts a `Node` (from `@odata-filter/core`) and returns the
desired output. You can use `iterate` to walk the tree and map each node to your target format.

## Errors and Troubleshooting

### I get `Cannot find module '@odata-filter/core'`

Make sure you have installed the package (`npm i @odata-filter/core --save`) and that your
project's `package.json` has the correct `@odata-filter` registry configured.

### My filter string parses incorrectly

Check that your filter string follows OData v4 syntax. String values must be wrapped in single
quotes (`'value'`). Field paths use `/` as a separator (`country/name`).

### `parse` throws for a valid-looking expression

Verify that the operators and functions you are using are in the
[supported feature list](#which-odata-v4-features-are-supported). If you believe the expression
is valid OData v4 and should be supported, please
[open an issue](https://github.com/prior-art/odata-filter/issues/new).
