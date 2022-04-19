import { StatusCodes } from 'http-status-codes';
import { IApiHttpRequest, IApiHttpResponse } from 'src/interfaces/http';

import { ExpressRouteAdapter } from './ExpressRouteAdapter';
import {
  makeFakeExpressRequest,
  makeFakeExpressResponse,
  makeFakeNextFunction,
} from './tests/TestHelper';

const makeControllerStub = (): jest.Mocked<{
  handle: (
    httpRequest: IApiHttpRequest<
      { name: string },
      { authorization?: string },
      { id?: string },
      { page?: string }
    >,
  ) => Promise<IApiHttpResponse<{ message: string }>>;
}> => ({
  handle: jest.fn().mockResolvedValue({
    statusCodeAsString: 'OK',
    headers: {
      'Content-Type': 'text/json',
    },
    body: {
      message: 'success',
    },
  }),
});

const makeSut = () => {
  const sut = ExpressRouteAdapter;

  return { sut };
};

describe(ExpressRouteAdapter.name, () => {
  describe(`When ${ExpressRouteAdapter.adapt.name} is called`, () => {
    it('Should call controller.handle', async () => {
      const { sut } = makeSut();
      const controllerStub = makeControllerStub();
      const req = makeFakeExpressRequest();
      const res = makeFakeExpressResponse();
      const next = makeFakeNextFunction();

      const adaptedRoute = await sut.adapt(controllerStub, 'handle');
      await adaptedRoute(req, res, next);

      expect(controllerStub.handle).toBeCalledWith(req);
    });

    it('Should call res.json with response.body when returns success response', async () => {
      const { sut } = makeSut();
      const controllerStub = makeControllerStub();
      const req = makeFakeExpressRequest();
      const res = makeFakeExpressResponse();
      const next = makeFakeNextFunction();

      const adaptedRoute = await sut.adapt(controllerStub, 'handle');
      await adaptedRoute(req, res, next);

      expect(res.set).toBeCalledWith('Content-Type', 'text/json');
      expect(res.status).toBeCalledWith(StatusCodes.OK);
      expect(res.json).toBeCalledWith({
        data: { message: 'success' },
        statusCode: 200,
        statusCodeAsString: 'OK',
      });
    });

    it('Should call next when controller throws', async () => {
      const { sut } = makeSut();
      const controllerStub = makeControllerStub();
      const req = makeFakeExpressRequest();
      const res = makeFakeExpressResponse();
      const next = makeFakeNextFunction();
      controllerStub.handle.mockRejectedValueOnce(
        new Error('any_controller_error'),
      );

      const adaptedRoute = await sut.adapt(controllerStub, 'handle');
      await adaptedRoute(req, res, next);

      expect(next).toBeCalledWith(new Error('any_controller_error'));
    });
  });
});
