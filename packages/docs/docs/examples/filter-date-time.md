---
layout: default
title: Filter on Date and Time Values
parent: Examples
nav_order: 9
---

# Filter on Date and Time Values

All date/time values must be in ISO 8601 format. The library uses the
[Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
internally.

```ts
// Date
const ast = parse(tokenize("createdAt gt 2024-01-01"));

// DateTimeOffset
const ast2 = parse(tokenize("createdAt gt 2024-01-01T00:00:00Z"));

// Use now() to compare against the current date/time
const ast3 = parse(tokenize("createdAt gt now()"));
```
