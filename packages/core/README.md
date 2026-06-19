# OData Filter Core

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
npm i @prior-art/odata-filter-core --save
```

### Basic Example

```ts
import { tokenize, parse } from '@prior-art/odata-filter-core';

const tokens = tokenize("country/name eq 'US' and age gte 21");

parse(tokens);

/*{
  type: 'logical_operator',
  value: 'and',
  left: {
    type: 'comparison_operator',
    value: 'eq',
    left: { type: 'field', value: 'country/name' },
    right: { type: 'string_value', value: 'US' }
  },
  right: {
    type: 'comparison_operator',
    value: 'gte',
    left: { type: 'field', value: 'age' },
    right: { type: 'number_value', value: 21 }
  }
}*/
```

### Traverse Results

```ts
import { tokenize, parse, iterate } from '@prior-art/odata-filter-core';

const tokens = tokenize("country eq 'US' and age gte 21");
const ast = parse(tokens);

iterate(ast);

/*[
  {
    type: 'logical_operator',
    value: 'and',
    left: {
      type: 'comparison_operator',
      value: 'eq',
      left: [Object],
      right: [Object]
    },
    right: {
      type: 'comparison_operator',
      value: 'gte',
      left: [Object],
      right: [Object]
    }
  },
  {
    type: 'comparison_operator',
    value: 'eq',
    left: { type: 'field', value: 'country' },
    right: { type: 'string_value', value: 'US' }
  },
  { type: 'field', value: 'country' },
  { type: 'string_value', value: 'US' },
  {
    type: 'comparison_operator',
    value: 'gte',
    left: { type: 'field', value: 'age' },
    right: { type: 'number_value', value: 21 }
  },
  { type: 'field', value: 'age' },
  { type: 'number_value', value: 21 }
]*/
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](../../LICENSE) for licensing information.

## Documentation

* [OData Standard v4](https://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)
* [JSONSchema](https://json-schema.org/)
