---
layout: default
title: Use the CLI for Local Testing
parent: Examples
nav_order: 7
---

# Use the CLI for Local Testing

The CLI lets you test filter expressions against a local `schema.json` without writing any code.

```sh
npm run dev "country eq 'US' and age gte 21"
# or with just
just dev "country eq 'US' and age gte 21"
```

Create a `schema.json` file at the project root with the field definitions you want to test
against:

```json
{
  "country": { "type": "string" },
  "age": { "type": "number" }
}
```

Use `--format` to control the output format. The default is `ast`; `json` produces a MongoDB query
object; `sql` produces a SQL `WHERE` clause string:

```sh
npm run dev -- --format sql "country eq 'US' and age gte 21"
# SQL "(country = 'US' AND age >= 21)"
```
