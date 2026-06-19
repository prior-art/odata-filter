# OData Filter Marshalers

* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Documentation](#documentation)

## Installation

See [INSTALL.md](https://github.com/prior-art/odata-filter/blob/main/INSTALL.md) for full instructions.

## Usage

### Package Installation

```sh
npm i @odata-filter/marshalers --save
```

### Basic Example

```ts
import { tokenize, parse } from '@odata-filter/core';
import { toMongoJson } from '@odata-filter/marshalers';

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

See [CONTRIBUTING.md](https://github.com/prior-art/odata-filter/blob/main/CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](https://github.com/prior-art/odata-filter/blob/main/LICENSE) for licensing information.

## Documentation

* [OData Standard v4](https://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)
