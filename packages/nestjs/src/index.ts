import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { toMongoJson, toSqlWhere } from '@odata-filter/marshalers';
import { queryHasFilter } from './predicates';

export type NestJsPluginOptions = {
  schema: JsonSchema;
  format?: 'mongo-json' | 'sql';
};

@Injectable()
export class ODataFilterInterceptor implements NestInterceptor {
  private readonly schema: JsonSchema;
  private readonly format: 'mongo-json' | 'sql' | undefined;

  constructor({ schema, format }: NestJsPluginOptions) {
    this.schema = schema;
    this.format = format;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ query: unknown }>();

    if (!queryHasFilter(request.query)) {
      return next.handle();
    }

    try {
      const tokens = tokenize(request.query.filter);
      const results = parse(tokens);
      validate(results, this.schema);

      let filterParsed: unknown;
      switch (this.format) {
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

      Object.assign(request.query, { filterParsed });
    } catch (err) {
      throw new HttpException(
        { message: (err as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }

    return next.handle();
  }
}

export default ODataFilterInterceptor;
