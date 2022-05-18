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
        const httpResponse: IApiHttpResponse = await controller[methodName]({
          body: req.body,
          headers: req.headers,
          params: req.params,
          query: req.query,
          user: req.user,
        });
        const formatedResponse =
          ExpressRouteAdapter.formatHttpResponse(httpResponse);
        ExpressRouteAdapter.setResponseHeaders(httpResponse, res);
        return res.status(formatedResponse.statusCode).json({
          ...formatedResponse,
        });
      } catch (error) {
        return next(error);
      }
    };
  }

  private static formatHttpResponse(
    response: IApiHttpResponse,
  ): IFormatedApiHttpResponse {
    return {
      statusCode: StatusCodes[response.statusCodeAsString],
      statusCodeAsString: response.statusCodeAsString,
      data: response.body,
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
