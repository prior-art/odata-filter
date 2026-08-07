import express, { type Request, type Response } from 'express';
import request from 'supertest';
import expressMiddleware from '.';
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

describe('#middleware', () => {
  test('it validates and parses the filter query parameter', async () => {
    expect.assertions(3);

    const app = express();
    app.use(expressMiddleware({ schema }));
    app.get('/', (req: Request, res: Response) => {
      expect((req.query as unknown as QueryFilter).filter).toEqual(odataStub);
      expect((req.query as unknown as QueryFilter).filterParsed).toEqual(astStub);
      res.status(200).send();
    });

    const { statusCode } = await request(app).get('/').query({ filter: odataStub });
    expect(statusCode).toEqual(200);
  });

  test('it throws a 400 error when validation fails', async () => {
    const app = express();
    app.use(expressMiddleware({ schema }));
    app.get('/', (_req: Request, res: Response) => {
      res.status(200).send({ hello: 'world' });
    });

    const { statusCode } = await request(app).get('/').query({ filter: 'country eq 2' });
    expect(statusCode).toEqual(400);
  });

  test('it skips if the filter parameter is not present', async () => {
    expect.assertions(2);

    const app = express();
    app.use(expressMiddleware({ schema }));
    app.get('/', (req: Request, res: Response) => {
      expect((req.query as unknown as QueryFilter).filterParsed).toBeUndefined();
      res.status(200).send();
    });

    const { statusCode } = await request(app).get('/');
    expect(statusCode).toEqual(200);
  });

  test('it supports different formats', async () => {
    expect.assertions(3);

    const app = express();
    app.use(expressMiddleware({ schema, format: 'mongo-json' }));
    app.get('/', (req: Request, res: Response) => {
      expect((req.query as unknown as QueryFilter).filter).toEqual(odataStub);
      expect((req.query as unknown as QueryFilter).filterParsed).toEqual(mongoJsonStub);
      res.status(200).send();
    });

    const { statusCode } = await request(app).get('/').query({ filter: odataStub });
    expect(statusCode).toEqual(200);
  });

  test('it supports the sql format', async () => {
    expect.assertions(3);

    const app = express();
    app.use(expressMiddleware({ schema, format: 'sql' }));
    app.get('/', (req: Request, res: Response) => {
      expect((req.query as unknown as QueryFilter).filter).toEqual(odataStub);
      expect((req.query as unknown as QueryFilter).filterParsed).toEqual("(country = 'US')");
      res.status(200).send();
    });

    const { statusCode } = await request(app).get('/').query({ filter: odataStub });
    expect(statusCode).toEqual(200);
  });
});
