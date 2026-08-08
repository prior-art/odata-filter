import { HttpException, HttpStatus } from '@nestjs/common';
import type { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import ODataFilterInterceptor from '.';
import { QueryFilter } from './types';

const mongoJsonStub = { country: 'US' };
const odataStub = "country eq 'US'";
const astStub = {
  type: 'comparison_operator',
  value: 'eq',
  left: { type: 'field', value: 'country' },
  right: { type: 'string_value', value: 'US' },
};

const schema = {
  country: { type: 'string' },
};

const makeContext = (query: unknown): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ query }),
    }),
  }) as unknown as ExecutionContext;

const callHandler: CallHandler = { handle: () => of(null) };

describe('#ODataFilterInterceptor', () => {
  test('it validates and parses the filter query parameter', () => {
    const query: Record<string, unknown> = { filter: odataStub };
    const interceptor = new ODataFilterInterceptor({ schema });

    interceptor.intercept(makeContext(query), callHandler);

    expect(query.filter).toEqual(odataStub);
    expect(query.filterParsed).toEqual(astStub);
  });

  test('it throws a 400 error when validation fails', () => {
    const query: Record<string, unknown> = { filter: 'country eq 2' };
    const interceptor = new ODataFilterInterceptor({ schema });

    expect(() => interceptor.intercept(makeContext(query), callHandler)).toThrow(
      new HttpException(
        { message: 'Invalid type for field country, expected string, received number' },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  test('it skips if the filter parameter is not present', () => {
    const query: Record<string, unknown> = {};
    const interceptor = new ODataFilterInterceptor({ schema });

    interceptor.intercept(makeContext(query), callHandler);

    expect((query as QueryFilter).filterParsed).toBeUndefined();
  });

  test('it supports mongo-json format', () => {
    const query: Record<string, unknown> = { filter: odataStub };
    const interceptor = new ODataFilterInterceptor({ schema, format: 'mongo-json' });

    interceptor.intercept(makeContext(query), callHandler);

    expect(query.filter).toEqual(odataStub);
    expect(query.filterParsed).toEqual(mongoJsonStub);
  });

  test('it supports sql format', () => {
    const query: Record<string, unknown> = { filter: odataStub };
    const interceptor = new ODataFilterInterceptor({ schema, format: 'sql' });

    interceptor.intercept(makeContext(query), callHandler);

    expect(query.filter).toEqual(odataStub);
    expect(query.filterParsed).toEqual("country = 'US'");
  });
});
