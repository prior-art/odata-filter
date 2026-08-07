---
layout: home
title: Home
nav_order: 1
---

# OData Filter Parser

An OData v4 standards-based `$filter` expression parser for building better REST APIs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org)

## What is OData Filter?

OData Filter is a set of Node.js packages that parse OData v4 `$filter` query-string expressions
into a typed Abstract Syntax Tree (AST). You can then validate that AST against a JSON Schema,
convert it into another query format (e.g. MongoDB query), or use it as raw structured data in
your application logic.

## Packages

| Package | Description |
|---------|-------------|
| [`@odata-filter/core`](https://github.com/prior-art/odata-filter/tree/main/packages/core) | TypeScript tokenizer + Pratt parser |
| [`@odata-filter/core-wasm`](https://github.com/prior-art/odata-filter/tree/main/packages/core-wasm) | AssemblyScript/WASM reimplementation of core |
| [`@odata-filter/validation`](https://github.com/prior-art/odata-filter/tree/main/packages/validation) | Validates an AST against a JSON Schema |
| [`@odata-filter/marshalers`](https://github.com/prior-art/odata-filter/tree/main/packages/marshalers) | Converts an AST to other query formats |
| [`@odata-filter/fastify`](https://github.com/prior-art/odata-filter/tree/main/packages/fastify) | Fastify plugin that parses the `filter` query parameter |

## Supported OData v4 Data Types

Boolean · Decimal · Double · Int16 · Int32 · Int64 · Single · String · Date · DateTimeOffset · TimeOfDay · Duration

## Get Started

- [Quickstart (Node.js)]({% link docs/quickstart-nodejs.md %})
- [Quickstart (WASM)]({% link docs/quickstart-wasm.md %})
- [Installation]({% link docs/installation.md %})
