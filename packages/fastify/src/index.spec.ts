import Fastify, { FastifyRequest, FastifyInstance } from 'fastify';
import fastifyPlugin from '.';
import { QueryFilter } from './types';

const mongoJsonStub = { country: 'US' };
const odataStub = "country eq 'US'";
const astStub = {
  type: 'comparison_operator',
  value: 'eq',
  left: { type: 'field', value: 'country' },
  right: { type: 'string_value', value: 'US' },
};

let fastify: FastifyInstance;

beforeEach(async () => {
  fastify = Fastify();

  fastify.addSchema({
    $id: 'qs2',
    type: 'object',
    properties: {
      country: {
        type: 'string',
      },
    },
  });
});

describe('#parser', () => {
  test('it validates and parses the filter query parameter', async () => {
    expect.assertions(3);

    fastify.register(async (instance) => {
      fastifyPlugin(instance, {
        schemaId: 'qs2',
      });
      instance.get('/', async ({ query }: FastifyRequest) => {
        expect((query as QueryFilter).filter).toEqual(odataStub);
        expect((query as QueryFilter).filterParsed).toEqual(astStub);
      });
    });

    const { statusCode, body } = await fastify.inject({
      method: 'GET',
      url: '/',
      query: {
        filter: odataStub,
      },
    });

    expect(statusCode).toEqual(200);
  });

  test('it throws a 400 error when validation fails', async () => {
    fastify.register(async (instance) => {
      fastifyPlugin(instance, {
        schemaId: 'qs2',
      });

      instance.get('/', async ({ query }: FastifyRequest) => {
        return {
          hello: 'world',
        };
      });
    });

    const { statusCode } = await fastify.inject({
      method: 'GET',
      url: '/',
      query: {
        filter: 'country eq 2',
      },
    });

    expect(statusCode).toEqual(400);
  });

  test('it skips if the filter parameter is not present', async () => {
    expect.assertions(2);

    fastify.register(async (instance) => {
      fastifyPlugin(instance, {
        schemaId: 'qs2',
      });
      instance.get('/', async ({ query }: FastifyRequest) => {
        expect(query).toEqual({});
      });
    });

    const { statusCode } = await fastify.inject({
      method: 'GET',
      url: '/',
      query: {},
    });

    expect(statusCode).toEqual(200);
  });

  test('it supports different formats', async () => {
    expect.assertions(3);

    fastify.register(async (instance) => {
      fastifyPlugin(instance, {
        schemaId: 'qs2',
        format: 'mongo-json',
      });

      instance.get('/', async ({ query }: FastifyRequest) => {
        expect((query as QueryFilter).filter).toEqual(odataStub);
        expect((query as QueryFilter).filterParsed).toEqual(mongoJsonStub);
      });
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      query: {
        filter: odataStub,
      },
    });

    expect(response.statusCode).toEqual(200);
  });
});
