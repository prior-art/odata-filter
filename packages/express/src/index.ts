import type { Request, Response, NextFunction } from 'express';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { queryHasFilter } from './predicates';
import { toMongoJson } from '@odata-filter/marshalers';

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

    switch (format) {
      case 'mongo-json': {
        const json = toMongoJson(results);
        req.query.filterParsed = json as unknown as string;
        break;
      }
      default:
        req.query.filterParsed = results as unknown as string;
        break;
    }

    return next();
  } catch (err) {
    res.status(400).send(err instanceof Error ? err.message : String(err));
  }
};

export default middleware;
