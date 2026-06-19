import type {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction,
} from 'fastify';
import { tokenize, parse } from '@odata-filter/core';
import { type JsonSchema, validate } from '@odata-filter/validation';
import { queryHasFilter } from './predicates';
import { toMongoJson } from '@odata-filter/marshalers';

const parser = (
  fastify: FastifyInstance,
  { schemaId, format }: FastifyPluginOptions,
): void => {
  fastify.addHook(
    'onRequest',
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      if (!queryHasFilter(request.query)) {
        return done();
      }

      const { properties }: JsonSchema = fastify.getSchema(
        schemaId,
      ) as unknown as JsonSchema;
      try {
        const tokens = tokenize(request.query.filter);
        const results = parse(tokens);
        validate(results, properties as JsonSchema);

        switch(format) {
          case 'mongo-json':
            const json = toMongoJson(results);
            request.query.filterParsed = json;
            break;
          default:
            request.query.filterParsed = results;
            break;
        }

        return done();
      } catch (err) {
        reply.status(400).send(err);
        return done();
      }
    },
  );
};

export default parser;
