import { Request, Response } from 'express';
import rateLimiter, {
  Options,
  RateLimitRequestHandler,
} from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

export default ({ windowMs, max }: Options): RateLimitRequestHandler => {
  return rateLimiter({
    windowMs: windowMs || 1 * 60 * 1000,
    max: max || 100,
    keyGenerator(req: Request): string {
      return req.ip;
    },
    handler(_req: Request, res: Response) {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        statusCodeAsString: 'TOO_MANY_REQUESTS',
        description: 'you reach the limit of requests for this resource',
      });
    },
  });
};
