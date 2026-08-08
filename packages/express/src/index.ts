import type { Request, Response, NextFunction } from 'express';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { queryHasFilter } from './predicates';
import { toMongoJson, toSqlWhere } from '@odata-filter/marshalers';

export type ExpressPluginOptions = {
  schema: JsonSchema;
  format?: string;
};

const middleware = (
  { schema, format }: ExpressPluginOptions,
) => (req: Request, res: Response, next: NextFunction): void => {
  if (!queryHasFilter(req.query)) {
    return next();
  }

  try {
    const tokens = tokenize(req.query.filter);
    const results = parse(tokens);
    validate(results, schema);

    let filterParsed: unknown;
    switch (format) {
      case 'mongo-json':
        filterParsed = toMongoJson(results);
        break;
      case 'sql':
        filterParsed = toSqlWhere(results);
        break;
      default:
        filterParsed = results;
        break;
    }

    Object.defineProperty(req, 'query', {
      value: Object.assign({}, req.query, { filterParsed }),
      writable: true,
      configurable: true,
      enumerable: true,
    });

    return next();
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
    next(err);
  }
};

export default middleware;
