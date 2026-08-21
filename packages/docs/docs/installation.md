---
layout: default
title: Installation
nav_order: 3
---

# Installation

## System Requirements

- Linux, macOS, or Windows 10/11 with WSL2
- Node.js >= 24 (manage versions with [NVM](https://github.com/nvm-sh/nvm))

## Install a Package

Install only the packages you need. All packages are published to the GitHub Packages registry under the `@odata-filter` scope.

### Core parser (Node.js)

```sh
npm i @odata-filter/core --save
```

### WASM parser

```sh
npm i @odata-filter/core-wasm --save
```

### Validation

```sh
npm i @odata-filter/validation --save
```

### Marshalers

```sh
npm i @odata-filter/marshalers --save
```

### Fastify plugin

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/fastify --save
```

### Express middleware

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/express --save
```

### NestJS interceptor

```sh
npm i @odata-filter/core @odata-filter/validation @odata-filter/nestjs --save
```

### CLI

```sh
npm i @odata-filter/core --save
npm i @odata-filter/cli --save-dev
```

## Verify the Installation

After installing, import and call `tokenize` to confirm the package resolves correctly.

```ts
import { tokenize } from '@odata-filter/core';

const tokens = tokenize("country eq 'US'");
console.log(tokens);
```

You should see an array of token objects printed to the console.

## IDE Support

Install the [DavidAnson.vscode-markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
extension in VS Code for markdown linting support when editing documentation.
