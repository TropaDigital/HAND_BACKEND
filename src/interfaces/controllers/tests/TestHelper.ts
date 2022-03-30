import { Controller } from '../Controller';

export const makeControllerStub = (): jest.Mocked<
  Controller<unknown, unknown>
> => ({
  handle: jest
    .fn()
    .mockReturnValue({ statusCode: 999, body: 'any_controller_body' }),
});
