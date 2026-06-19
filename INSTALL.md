# INSTALLATION

* [Overview](#overview)
* [System Requirements](#system-requirements)
* [Prerequisites](#prerequisites)
* [Installation Steps](#installation-steps)
* [Testing](#testing)
* [IDE support](#ide-support)

## Overview

This project is a NodeJS-based backend library. It can be used to build middleware in a vanilla service, or as a Fastify plugin.

## System Requirements

* Linux, macOS, or Windows 10/11 with WSL2

## Prerequisites

* NVM -> to manage node versions
* Node.js -> review last version on [package.json](/package.json) on `engines` object.

## Installation Steps

### Install the project

```sh
    git clone git@github.com:prior-art/odata-filter.git

    npm i
```

## Testing

Run tests to ensure dependencies are installed correctly.

```sh
npm test
```

## Build

Transpile the source code to ensure types resolve and CommonJS is emitted.

```sh
npm run build
```

## Local Dev Testing

A CLI tool is included to aid in testing changes locally.

```sh
npm run dev "country eq 'US' and age gte 21"
```

Note: a `schema.json` file must be created at the root of the project, containing the schema to test against.

## IDE support

### Markdownlint

You may want to install the markdownlint extension for your IDE to help you with the markdown syntax. For example, in VSCode you can install the extension [DavidAnson.vscode-markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint). This will help you to keep the markdown files well formatted and avoid common mistakes.
