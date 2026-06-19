# OData Filter Marshalers

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
npm i @prior-art/odata-filter-marshalers --save
```

### Basic Example

```ts
import { tokenize, parse } from '@prior-art/odata-filter-core';
import { toMongoJson } from '@prior-art/odata-filter-marshalers';

const tokens = tokenize("country/name eq 'US' and age gte 21");

const ast = parse(tokens);

console.log(ast);
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

toMongoJson(ast);
/*{
  $and: [
    { 'country/name': { $eq: 'US' } },
    { age: { $gte: 21 } }
  ]
}*/
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](../../LICENSE) for licensing information.

## Documentation

* [OData Standard v4](https://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)
* [JSONSchema](https://json-schema.org/)
