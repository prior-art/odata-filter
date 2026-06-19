# OData Filter Core (WebAssembly)

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
npm i @odata-filter/core-wasm --save
```

### Basic Example

Note: The output of the 'parse' function differs from the [TypeScript version](../core/README.md) as union types are not supported in AssemblyScript. The 'format' property indicates the original token type, and the 'raw' property contains the original token string. The 'stringValue', 'intValue', 'floatValue', 'boolValue', and 'arrayValue' properties are used to store the parsed value based on the token type.

```ts
(async () => {
    // AssemblyScript WebAssembly modules return a Promise that resolves to the module's exports when imported.
    const { tokenize, parse } = await import('@odata-filter/core-wasm');

    const tokens = tokenize("country/name eq 'US' and age gte 21");

    parse(tokens);

    /*{
      type: 3,
      value: {
        format: 1,
        raw: 'and',
        stringValue: 'and',
        intValue: 0,
        floatValue: 0,
        boolValue: false,
        arrayValue: []
      },
      left: {
        type: 1,
        value: {
          format: 1,
          raw: 'eq',
          stringValue: 'eq',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: {
          type: 4,
          value: {
            format: 1,
            raw: 'country/name',
            stringValue: 'country/name',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        },
        right: {
          type: 5,
          value: {
            format: 1,
            raw: "'US'",
            stringValue: 'US',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        }
      },
      right: {
        type: 1,
        value: {
          format: 1,
          raw: 'gte',
          stringValue: 'gte',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: {
          type: 4,
          value: {
            format: 1,
            raw: 'age',
            stringValue: 'age',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        },
        right: {
          type: 6,
          value: {
            format: 2,
            raw: '21',
            stringValue: '',
            intValue: 21,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        }
      }
    }*/
)();
```

### Traverse Results

```ts
(async () => {
    const { iterate, tokenize, parse } = await import('@odata-filter/core-wasm');

    const tokens = tokenize("country eq 'US' and age gte 21");
    const ast = parse(tokens);

    iterate(ast);

    /*[
      {
        type: 3,
        value: {
          format: 1,
          raw: 'and',
          stringValue: 'and',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: {
          type: 1,
          value: {
            format: 1,
            raw: 'eq',
            stringValue: 'eq',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: {
            type: 4,
            value: {
              format: 1,
              raw: 'country/name',
              stringValue: 'country/name',
              intValue: 0,
              floatValue: 0,
              boolValue: false,
              arrayValue: []
            },
            left: null,
            right: null
          },
          right: {
            type: 5,
            value: {
              format: 1,
              raw: "'US'",
              stringValue: 'US',
              intValue: 0,
              floatValue: 0,
              boolValue: false,
              arrayValue: []
            },
            left: null,
            right: null
          }
        },
        right: {
          type: 1,
          value: {
            format: 1,
            raw: 'gte',
            stringValue: 'gte',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: {
            type: 4,
            value: {
              format: 1,
              raw: 'age',
              stringValue: 'age',
              intValue: 0,
              floatValue: 0,
              boolValue: false,
              arrayValue: []
            },
            left: null,
            right: null
          },
          right: {
            type: 6,
            value: {
              format: 2,
              raw: '21',
              stringValue: '',
              intValue: 21,
              floatValue: 0,
              boolValue: false,
              arrayValue: []
            },
            left: null,
            right: null
          }
        }
      },
      {
        type: 1,
        value: {
          format: 1,
          raw: 'eq',
          stringValue: 'eq',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: {
          type: 4,
          value: {
            format: 1,
            raw: 'country/name',
            stringValue: 'country/name',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        },
        right: {
          type: 5,
          value: {
            format: 1,
            raw: "'US'",
            stringValue: 'US',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        }
      },
      {
        type: 4,
        value: {
          format: 1,
          raw: 'country/name',
          stringValue: 'country/name',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      },
      {
        type: 5,
        value: {
          format: 1,
          raw: "'US'",
          stringValue: 'US',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      },
      {
        type: 1,
        value: {
          format: 1,
          raw: 'gte',
          stringValue: 'gte',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: {
          type: 4,
          value: {
            format: 1,
            raw: 'age',
            stringValue: 'age',
            intValue: 0,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        },
        right: {
          type: 6,
          value: {
            format: 2,
            raw: '21',
            stringValue: '',
            intValue: 21,
            floatValue: 0,
            boolValue: false,
            arrayValue: []
          },
          left: null,
          right: null
        }
      },
      {
        type: 4,
        value: {
          format: 1,
          raw: 'age',
          stringValue: 'age',
          intValue: 0,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      },
      {
        type: 6,
        value: {
          format: 2,
          raw: '21',
          stringValue: '',
          intValue: 21,
          floatValue: 0,
          boolValue: false,
          arrayValue: []
        },
        left: null,
        right: null
      }
    ]*/
)();
```

## Contributing

See [CONTRIBUTING.md](https://github.com/prior-art/odata-filter/blob/main/CONTRIBUTING.md) for full instructions.

## License

See [LICENSE](https://github.com/prior-art/odata-filter/blob/main/LICENSE) for licensing information.

## Documentation

* [OData Standard v4](https://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)
* [JSONSchema](https://json-schema.org/)
