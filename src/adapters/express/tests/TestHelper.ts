import { NextFunction, Request, Response } from 'express';

export const makeFakeExpressRequest = (): jest.Mocked<Request> => {
  const result: jest.Mocked<Partial<Request>> = {
    body: { value: 'any_request_body' },
  };
  return result as jest.Mocked<Request>;
};

export const makeFakeExpressResponse = (): jest.Mocked<Response> => {
  const result: jest.Mocked<Partial<Response>> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn(),
    set: jest.fn(),
  };
  return result as jest.Mocked<Response>;
};

export const makeFakeNextFunction = (): NextFunction => jest.fn();
