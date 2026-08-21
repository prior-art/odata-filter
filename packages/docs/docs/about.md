---
layout: default
title: About
nav_order: 2
---

# About OData Filter

If you're building a REST API in Node.js, at some point a consumer of that API is going to ask
for a way to filter, sort, or search a list endpoint by something more specific than "give me
everything." OData Filter exists to make that request easy, safe, and consistent to support —
without you having to invent your own query language or bolt together ad-hoc query-string
parsing every time a new filtering need comes up.

## The problem with "just add a query parameter"

Most APIs start simple: a `?status=active` here, a `?minPrice=10` there. It works, until a client
needs to combine conditions — active *and* over a certain price, *or* created in the last week.
Now every new combination means another bespoke parameter, another block of parsing logic in a
route handler, and another set of edge cases (What if the value is missing? Malformed? The wrong
type? What happens if someone passes raw text straight into a database query?). This kind of code
tends to sprawl across an API's endpoints, with each one reinventing its own dialect of "filter
syntax" and its own set of bugs.

## A standard instead of a one-off

OData v4 is an open, widely adopted standard for expressing exactly this kind of query — `$filter`
expressions like `status eq 'active' and price gt 10`. It's expressive enough to cover comparisons,
boolean logic, string functions, and multiple data types, but it's still just a single query
string parameter. Because it's a standard, client developers who have seen it before don't need to
learn anything new to use your API, and the ones who haven't have a well-documented specification
and countless examples to draw from — instead of reading your bespoke filtering docs from scratch.

OData Filter's job is to take that `$filter` string and turn it into a structured, typed
representation your application code can trust — so you write the standard once, rather than
reinventing a smaller, buggier version of it for every endpoint.

## Why teams adopt it

- **Less boilerplate to write and maintain.** One parser handles filtering for every endpoint,
  instead of hand-rolled query-string parsing duplicated (and subtly inconsistent) across route
  handlers.
- **Safer by default.** Filter expressions are parsed into a typed structure and can be validated
  against your schema before they ever reach a data layer, rather than trusting raw strings or
  hand-built query fragments.
- **Not locked to one database.** The same parsed filter can be converted to different query
  formats — MongoDB, SQL, and others — so switching or supporting multiple data stores doesn't
  mean rewriting how filtering works for your API's consumers.
- **A query language your clients already understand.** OData v4 is a documented, public
  standard, so API consumers can lean on existing knowledge and tooling instead of learning a
  filtering syntax unique to your service.
- **Drop-in for popular frameworks.** Fastify, Express, and NestJS integrations are available, so
  adding standards-based filtering to an existing API doesn't require restructuring it.

## Where to go next

- [Installation]({% link docs/installation.md %}) — add the packages you need to your project.
- [Quickstart (Node.js)]({% link docs/quickstart-nodejs.md %}) — parse your first `$filter`
  expression.
- [FAQ]({% link docs/faq.md %}) — answers to common questions about supported features and
  troubleshooting.
