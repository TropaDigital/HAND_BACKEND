import { makeControllerStub } from '../../interfaces/controllers/tests/TestHelper';
import { ExpressRouteAdapter } from './ExpressRouteAdapter';
import {
  makeFakeExpressRequest,
  makeFakeExpressResponse,
  makeFakeNextFunction,
} from './tests/TestHelper';

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

      const adaptedRoute = await sut.adapt(controllerStub);
      await adaptedRoute(req, res, next);

      expect(controllerStub.handle).toBeCalledWith(req);
    });

    it('Should call res.json with response.body when returns success response', async () => {
      const { sut } = makeSut();
      const controllerStub = makeControllerStub();
      const req = makeFakeExpressRequest();
      const res = makeFakeExpressResponse();
      const next = makeFakeNextFunction();

      const adaptedRoute = await sut.adapt(controllerStub);
      await adaptedRoute(req, res, next);

      expect(res.status).toBeCalledWith(999);
      expect(res.json).toBeCalledWith('any_controller_body');
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

      const adaptedRoute = await sut.adapt(controllerStub);
      await adaptedRoute(req, res, next);

      expect(next).toBeCalledWith(new Error('any_controller_error'));
    });
  });
});
