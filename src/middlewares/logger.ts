import { Request, Response } from 'express';
import morgan, { TokenIndexer } from 'morgan';

import { LoggerFactory } from '../factories/LoggerFactory';

const Logger = LoggerFactory.create();

morgan.token('body', (req: Request) => {
  const { password, newPassword, oldPassword, passwordConfirmation, ...rest } =
    req.body;
  return rest;
});

morgan.token('headers', (req: Request) => JSON.stringify(req.headers));

export default morgan(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) =>
    JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      contentLenght: tokens.res(req, res, 'content-length'),
      responseTime: `${tokens['response-time'](req, res)}ms`,
      userAgent: tokens['user-agent'](req, res),
      referrer: tokens.referrer(req, res),
      totalTime: `${tokens['total-time'](req, res)}ms`,
      'remote-addr': tokens['remote-addr'](req, res),
      'remote-user': tokens['remote-user'](req, res),
      headers: tokens.headers(req, res),
      body: tokens.body(req, res),
    }),
  {
    stream: {
      write(message) {
        Logger.info({ msg: JSON.parse(message) });
      },
    },
  },
);
