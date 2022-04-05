import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IApiHttpRequest,
  IApiHttpResponse,
  IFormatedApiHttpResponse,
} from '../../interfaces/http';

export class ExpressRouteAdapter {
  public static adapt<
    Controller = {
      [key: string]: (
        httpRequest: IApiHttpRequest,
      ) => Promise<IApiHttpResponse>;
    },
  >(
    controller: {
      [key in keyof Controller]: (
        httpRequest: IApiHttpRequest,
      ) => Promise<IApiHttpResponse>;
    },
    methodName: keyof Controller,
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | void> => {
      try {
        const IHttpResponse: IApiHttpResponse = await controller[methodName]({
          body: req.body,
          headers: req.headers,
          params: req.params,
          query: req.query,
        });
        ExpressRouteAdapter.setResponseHeaders(IHttpResponse, res);
        return res.status(StatusCodes[IHttpResponse.statusCodeAsString]).json({
          statusCode: StatusCodes[IHttpResponse.statusCodeAsString],
          statusCodeAsString: IHttpResponse.statusCodeAsString,
          data: IHttpResponse.body,
        } as IFormatedApiHttpResponse);
      } catch (error) {
        return next(error);
      }
    };
  }

  private static setResponseHeaders(
    response: IApiHttpResponse,
    res: Response,
  ): void {
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) =>
        res.set(key, value),
      );
    }
  }
}
