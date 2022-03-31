import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IHttpFormatedResponse } from 'src/interfaces/http/FormatedApiHttpResponse';

import { ApiHttpRequest, ApiHttpResponse } from '../../interfaces/http';

export class ExpressRouteAdapter {
  public static adapt<
    Controller = {
      [key: string]: (httpRequest: ApiHttpRequest) => Promise<ApiHttpResponse>;
    },
  >(
    controller: {
      [key in keyof Controller]: (
        httpRequest: ApiHttpRequest,
      ) => Promise<ApiHttpResponse>;
    },
    methodName: keyof Controller,
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | void> => {
      try {
        const httpResponse: ApiHttpResponse = await controller[methodName]({
          body: req.body,
          headers: req.headers,
          params: req.params,
          query: req.query,
        });
        ExpressRouteAdapter.setResponseHeaders(httpResponse, res);
        return res.status(StatusCodes[httpResponse.statusCodeAsString]).json({
          statusCode: StatusCodes[httpResponse.statusCodeAsString],
          statusCodeAsString: httpResponse.statusCodeAsString,
          data: httpResponse.body,
        } as IHttpFormatedResponse);
      } catch (error) {
        return next(error);
      }
    };
  }

  private static setResponseHeaders(
    response: ApiHttpResponse,
    res: Response,
  ): void {
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) =>
        res.set(key, value),
      );
    }
  }
}
