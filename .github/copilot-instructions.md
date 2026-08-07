# Copilot Instructions

## Repository Overview

This is an npm workspaces monorepo (`packages/*`) implementing an OData v4 `$filter` expression
parser and related tooling. `packages/core` (tokenizer + Pratt parser) is the foundation; every
other package depends on its AST shape:

- **`packages/core`** — `tokenize()` (lexer) → `parse()` (Pratt/TDOP parser) → `iterate()`
  (depth-first AST walker). Produces the canonical `Node` AST (see `src/parser/types.ts`).
- **`packages/core-wasm`** — AssemblyScript reimplementation of `core`, compiled to WASM
  (source in `assembly/`, not `src/`). Its output shape differs from `core`: since AssemblyScript
  has no union types, `Node.value` is a flattened struct with `format`/`raw`/`stringValue`/
  `intValue`/`floatValue`/`boolValue`/`arrayValue` fields instead of one typed `TokenValue`.
- **`packages/marshalers`** — Converts a `core` AST into other query formats (e.g. `toMongoJson`
  for MikroORM/MongoDB queries).
- **`packages/validation`** — Validates a `core` AST's field types/operators against a JSON Schema.
- **`packages/fastify`** — Fastify plugin wiring `core` + `validation` + `marshalers` together to
  parse a `filter` query-string parameter into `request.query.filterParsed`.
- **`packages/cli`** — Commander-based CLI (`odata-filter-cli`) exposing tokenize/parse/validate/
  marshal behavior, usable against a local `schema.json` for manual testing (`npm run dev`).
- **`packages/docs`** — Jekyll site deployed to GitHub Pages.

### Lexer/Parser internals (`packages/core/src`)

- The lexer (`lexer/tokenizer.ts`, `lexer/defaultLexer.ts`) matches source text against an ordered
  list of regex `TokenPattern`s (`lexer/lookups.ts`) and formats raw matches into typed values via
  a `TokenType -> formatter` lookup table (`lexer/formatters.ts`).
- The parser (`parser/handlers.ts`, `parser/defaultParser.ts`) is a Pratt/TDOP (top-down operator
  precedence) parser: each `TokenType` maps to a `NodeType`, a `ParseStrategy` (`NUD` for
  prefix/literal positions, `LED` for infix positions), and a `BindingPower` via lookup tables in
  `parser/lookups.ts`. When adding a new operator/token, you generally need to update the lexer
  pattern, the formatter, and all three parser lookup tables together.
- Date/time values are parsed/formatted with the `Temporal` API (`@js-temporal/polyfill`), not
  native `Date`.

## Build, Lint, Test

Requires Node >= 24.11.1 / npm >= 11.6.2 (see `.nvmrc` for the exact version via `nvm use`).

A `justfile` at the repo root wraps all common npm scripts. Prefer `just` for local development:

```sh
just build                  # tsc across all workspaces
just lint                   # eslint across all workspaces
just lint-fix               # eslint --fix, then pre-commit run -a
just test                   # vitest run across all workspaces
just test-mutation          # stryker (mutation testing) across all workspaces

just build core             # scope build/lint/test/etc. to one package
just test core
just test-watch core        # vitest watch mode for a single package
just audit core             # npm audit --omit=dev for a single package
```

The underlying npm scripts remain unchanged and can still be used directly:

```sh
npm run build                              # tsc across all workspaces
npm test --workspace=packages/core         # scope any script to one package
```

- Each TS package's `test` script is `vitest -c ../../vitest.config.ts run` — the shared config
  lives at the repo root (`vitest.config.ts`), not per-package.
- To run a single test file or test name, pass vitest args after `--`:
  `npm test --workspace=packages/core -- src/lexer/tokenizer.spec.ts`
  `npm test --workspace=packages/core -- -t "test name"`
  Note: coverage thresholds (100% branches, enforced via `vitest.config.ts`) apply even to a
  filtered run and will report as failing if the filtered subset doesn't hit every branch — this
  is expected for a narrowed run and isn't a real regression.
- `packages/core-wasm` uses a different toolchain: `asc` (AssemblyScript compiler) for `build`,
  `as-test` for `test`, and has no mutation testing (`test:mutation` is a no-op).
- Mutation testing (Stryker, `stryker.config.json`) enforces a 100% mutation score
  (`thresholds.break: 100`) on all non-wasm packages; CI runs it per-package.
- ESLint config is centralized at the repo root (`eslint.config.js`); most packages invoke it via
  `eslint -c ../../eslint.config.js` rather than defining their own.
- CI (`.github/workflows/ci.yml`) only runs a package's checks when files under that package (or
  shared root config) changed, via path-diffing into `ci-checks.yml` (lint, build, test, mutation,
  Codacy coverage per package).

## Conventions

- Avoid comments in `src/**/*.ts` files — only comment where genuinely necessary to clarify
  non-obvious logic.
- Enum-keyed lookup tables (`Record<TokenType, ...>`) are the preferred way to dispatch behavior
  per token/node type, rather than `switch` statements or if/else chains (see `lexer/lookups.ts`,
  `parser/lookups.ts`).
- Package READMEs link back to the root `INSTALL.md`, `CONTRIBUTING.md`, and `LICENSE` rather than
  duplicating that content — follow this pattern if adding a new package.
- Branches follow `feat/DP-12345_brief_description`; PRs are squash-merged into `main`
  (see `CONTRIBUTING.md`).
- Commit messages and branch names must follow **Conventional Commits** conventions and reference
  the linked issue. Branch format: `<type>/issues-<number>` (e.g. `chore/issues-39`). Commit
  format: `<type>: [Issues: <number>] <description>` (e.g.
  `chore: [Issues: 39] add justfile with npm script wrappers`).
- Prefer early returns over `else` branches: when an `if` block ends with a `return`/`break`, use
  an early return/break and omit the `else`.
