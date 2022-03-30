import { NextFunction, Request, Response } from 'express';

import { Controller } from '../../interfaces/controllers';

export class ExpressRouteAdapter {
  public static adapt<T, K>(controller: Controller<T, K>) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const request = {
          body: req.body,
        };
        const httpResponse = await controller.handle(request);

        res.status(httpResponse.statusCode).json(httpResponse.body);
      } catch (error) {
        next(error);
      }
    };
  }
}
