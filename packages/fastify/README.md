# OData Filter Fastify Plugin

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
npm i @odata-filter/core @odata-filter/validation @odata-filter/fastify --save
```

### Basic Example

```ts
import Fastify from 'fastify';
import { fastifyPlugin } from '@odata-filter/fastify';

const fastify = Fastify();

fastify.addSchema({
  $id: 'qs',
  type: 'object',
  properties: {
    country: {
      type: 'string',
    },
  },
});

fastify.register(async (instance) => {
    fastifyPlugin(instance, {
        schemaId: 'qs',
    });

    // HTTP GET /?filter=country+eq+%27US%27

    instance.get('/', async ({ query: { filter, filterParsed } }: FastifyRequest) => {
      console.log("Raw: ", filter);
      console.log("Parsed: ", filterParsed);
    });
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
fastify.register(async (instance) => {
    fastifyPlugin(instance, {
        schemaId: 'qs',
        format: 'mongo-json',
    });

    // HTTP GET /?filter=country+eq+%27US%27

    instance.get('/', async ({ query: { filter, filterParsed } }: FastifyRequest) => {
      console.log("Raw: ", filter);
      console.log("Parsed: ", filterParsed);
    });
});

// Raw: "country eq 'US'"
/* Parsed: { country: 'US' } */
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](/../../LICENSE) for licensing information.

## Documentation

* [Fastify Plugins](https://fastify.dev/docs/latest/Reference/Plugins/)
