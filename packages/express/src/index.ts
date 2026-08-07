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

    const query = req.query as Record<string, unknown>;
    switch (format) {
      case 'mongo-json':
        query.filterParsed = toMongoJson(results);
        break;
      case 'sql':
        query.filterParsed = toSqlWhere(results);
        break;
      default:
        query.filterParsed = results;
        break;
    }

    return next();
  } catch (err) {
    res.status(400).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default middleware;
