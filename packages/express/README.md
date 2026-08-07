# OData Filter Express Middleware

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
npm i @odata-filter/core @odata-filter/validation @odata-filter/express --save
```

### Basic Example

```ts
import express from 'express';
import expressMiddleware from '@odata-filter/express';

const app = express();

const schema = {
  country: { type: 'string' },
};

app.use(expressMiddleware({ schema }));

// HTTP GET /?filter=country+eq+%27US%27

app.get('/', (req, res) => {
  const { filter, filterParsed } = req.query;
  console.log('Raw:', filter);
  console.log('Parsed:', filterParsed);
  res.send();
});

// Raw: "country eq 'US'"
/* Parsed: {
  type: 'comparison_operator',
  value: 'eq',
  left: { type: 'field', value: 'country' },
  right: { type: 'string_value', value: 'US' }
}*/
```

### Format Options

```ts
app.use(expressMiddleware({ schema, format: 'mongo-json' }));

// HTTP GET /?filter=country+eq+%27US%27

app.get('/', (req, res) => {
  const { filter, filterParsed } = req.query;
  console.log('Raw:', filter);
  console.log('Parsed:', filterParsed);
  res.send();
});

// Raw: "country eq 'US'"
/* Parsed: { country: 'US' } */
```

## Contributing

See [CONTRIBUTING.md](https://github.com/prior-art/odata-filter/blob/main/CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](https://github.com/prior-art/odata-filter/blob/main/LICENSE) for licensing information.

## Documentation

* [Express Middleware](https://expressjs.com/en/guide/writing-middleware.html)
