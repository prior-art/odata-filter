# OData Filter NestJS Interceptor

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
npm i @odata-filter/core @odata-filter/validation @odata-filter/nestjs --save
```

### Basic Example

```ts
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ODataFilterInterceptor } from '@odata-filter/nestjs';

const schema = {
  country: { type: 'string' },
};

@Controller()
export class AppController {
  @Get('/')
  @UseInterceptors(new ODataFilterInterceptor({ schema }))
  getRoot(@Query() query) {
    const { filter, filterParsed } = query;
    console.log('Raw:', filter);
    console.log('Parsed:', filterParsed);
    return filterParsed;
  }
}

// HTTP GET /?filter=country+eq+%27US%27

// Raw: "country eq 'US'"
/* Parsed: {
  type: 'comparison_operator',
  value: 'eq',
  left: { type: 'field', value: 'country' },
  right: { type: 'string_value', value: 'US' }
}*/
```

### Format Options

Pass `format: 'mongo-json'` to receive a MongoDB query object:

```ts
@Get('/')
@UseInterceptors(new ODataFilterInterceptor({ schema, format: 'mongo-json' }))
getRoot(@Query() query) {
  const { filter, filterParsed } = query;
  console.log('Raw:', filter);
  console.log('Parsed:', filterParsed);
  return filterParsed;
}

// HTTP GET /?filter=country+eq+%27US%27

// Raw: "country eq 'US'"
/* Parsed: { country: 'US' } */
```

Pass `format: 'sql'` to receive a SQL `WHERE` clause string:

```ts
@Get('/')
@UseInterceptors(new ODataFilterInterceptor({ schema, format: 'sql' }))
getRoot(@Query() query) {
  const { filter, filterParsed } = query;
  console.log('Raw:', filter);
  console.log('Parsed:', filterParsed);
  return filterParsed;
}

// HTTP GET /?filter=country+eq+%27US%27

// Raw: "country eq 'US'"
// Parsed: "country = 'US'"
```

If validation fails, the interceptor throws an `HttpException` with a `400 Bad Request` status and
a descriptive message.

## Contributing

See [CONTRIBUTING.md](https://github.com/prior-art/odata-filter/blob/main/CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](https://github.com/prior-art/odata-filter/blob/main/LICENSE) for licensing information.

## Documentation

* [NestJS Interceptors](https://docs.nestjs.com/interceptors)
