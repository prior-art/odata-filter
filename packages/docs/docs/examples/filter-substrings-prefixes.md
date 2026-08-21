---
layout: default
title: Filter on Substrings and Prefixes
parent: Examples
nav_order: 8
---

# Filter on Substrings and Prefixes

## Use `contains()` to Filter on Substrings

The `contains(field, 'value')` function checks whether a field's value contains the given
substring.

```ts
const ast = parse(tokenize("contains(description, 'free')"));
```

## Use `startswith()` to Filter on Prefixes

The `startswith(field, 'value')` function checks whether a field's value begins with the given
prefix.

```ts
const ast = parse(tokenize("startswith(name, 'Eliz')"));
```

## Use `trim()` to Strip Whitespace

The `trim(field)` function strips leading and trailing whitespace from a field's value before
comparing it.

```ts
const ast = parse(tokenize("trim(CompanyName) eq 'Alfreds Futterkiste'"));
```
