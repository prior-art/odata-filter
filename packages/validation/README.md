# OData Filter Validation

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
npm i @prior-art/odata-filter-validation --save
```

### Basic Example

```ts
import { validate } from '@prior-art/odata-filter-validation';

const ast = {
    type: 'comparison_operator',
    value: 'gte',
    left: { type: 'field', value: 'age' },
    right: { type: 'number_value', value: 'twenty one' }
}

validate(ast, {
  age: {
    type: 'number'
  }
});

// Error: Operator of type gte expects number_value, received string_value
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](../../LICENSE) for licensing information.

## Documentation

* [OData Standard v4](https://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)
* [JSONSchema](https://json-schema.org/)
