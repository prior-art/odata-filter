# OData Filter Playground

* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Installation

See [INSTALL.md](https://github.com/prior-art/odata-filter/blob/main/INSTALL.md) for full instructions.

Install workspace dependencies from the repository root:

```sh
npm install
```

## Usage

Start the Electron app in development mode:

```sh
npm run dev --workspace=packages/playground
```

Use the field, comparison, logical, function, literal, and structure buttons to compose a filter.
The expression, tokens, AST, and JSON Schema validation update live.

The app includes an example schema, supports loading another JSON schema, and can save or load a
playground JSON document containing both the expression and schema. Use **Copy** to place the
generated filter on the clipboard.

Build package artifacts for the current platform:

```sh
npm run build --workspace=packages/playground
```

## Contributing

See [CONTRIBUTING.md](https://github.com/prior-art/odata-filter/blob/main/CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](https://github.com/prior-art/odata-filter/blob/main/LICENSE) for details.
