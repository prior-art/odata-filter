# OData Filter Parser

An OData standards based parser for building better REST APIs using the filter query parameter.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6b6c9c44121d4724a8f413657ca49097)](https://app.codacy.com/gh/prior-art/odata-filter/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/6b6c9c44121d4724a8f413657ca49097)](https://app.codacy.com/gh/prior-art/odata-filter/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

## OData v4 Conformance

### Data Types

This project supports the following OData v4 primitive data types:

- Boolean
- Decimal
- Double
- Int16
- Int32
- Int64
- Single
- String
- Date
- DateTimeOffset
- TimeOfDay
- Duration

Date/Time values are expected to be in ISO 8601 format. The [Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) is used for parsing and formatting date/time values.

See [OData v4 Primitive Types](https://docs.oasis-open.org/odata/odata/v4.0/csprd02/part3-csdl/odata-v4.0-csprd02-part3-csdl.html#_Toc360208768) for more information.

## Unsupported Features

The following OData v4 features are not currently supported by this project:

- functions
- the `has` operator
- arithmetic operators
- parameter aliasing

## Packages

For more information, please refer to the package documentation below.

[Core](./packages/core/README.md)
[WASM-Based Core](./packages/core-wasm/README.md)
[Fastify Plugin](./packages/fastify/README.md)
[CLI](./packages/cli/README.md)
[Marshalers](./packages/marshalers/README.md)
[Validation](./packages/validation/README.md)
