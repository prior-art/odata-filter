# OData Filter CLI

* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Documentation](#documentation)

## Installation

See [INSTALL.md](../../INSTALL.md) for full instructions.

## Usage

### Package Installation

```sh
npm i @odata-filter/core --save
npm i @odata-filter/cli --save-dev
```

### Basic Example

```sh
odata-filter-cli "country/name eq 'US' and age gte 21"
```

### Help Documentation

The library also features a robust command line interface. For help documentation, run:

```sh
odata-filter-cli --help
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](../../LICENSE) for licensing information.

## Documentation

* [Commander CLI Tool](https://github.com/tj/commander.js)
