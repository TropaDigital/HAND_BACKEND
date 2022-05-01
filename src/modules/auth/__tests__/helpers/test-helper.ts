import { StatusCodes } from 'http-status-codes';

import { IApiHttpRequest, IApiHttpResponse } from '../../../../interfaces/http';
import { IValidator } from '../../../../interfaces/validation/IValidator';
import { IResponseUser } from '../../../user/interfaces';
import { IAuthResult, IAuthService } from '../../interfaces';

export const makeLoginServiceStub = (
  payload?: IAuthResult,
): jest.Mocked<IAuthService> => ({
  authenticate: jest.fn().mockResolvedValue({
    ...{ login: 'any_user_name', token: 'any_token' },
    ...payload,
  }),
});

export const makeValidatorStub = (): jest.Mocked<IValidator> => ({
  validateSchema: jest.fn().mockReturnValue({ id: 777 }),
});

export const makeFakeApiHttpRequest = ({
  body,
  params,
  headers,
  user,
}: {
  body?: unknown;
  params?: { [key: string]: any };
  headers?: { [key: string]: string | string[] | undefined };
  user?: IResponseUser;
}): jest.Mocked<IApiHttpRequest> => ({ body, params, headers, user });

export const makeFakeApiHttpResponse = (
  status: keyof typeof StatusCodes,
  body?: unknown,
): jest.Mocked<IApiHttpResponse> => ({
  body,
  statusCodeAsString: status || 'OK',
});
