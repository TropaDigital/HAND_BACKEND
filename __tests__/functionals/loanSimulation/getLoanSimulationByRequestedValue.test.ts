import { StatusCodes } from 'http-status-codes';

import ErrorCodes from '../../../src/enums/ErrorCodes';
import { MonthOfPayment } from '../../../src/enums/MonthOfPayment';
import { IFormatedApiHttpResponse } from '../../../src/interfaces/http';
import {
  loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDayCurrentMonth,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPayment,
  loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPaymentRequestedValueLowerThan1000,
  loanSimulationOfDay15OfTheMonthWithTelemedicine,
} from '../../../src/modules/loanSimulation/__tests__/fixtures';
import { makeLoanSimulationBasedOnRequestedValueParams } from '../../../src/modules/loanSimulation/__tests__/helpers/test-helper';
import { ILoanSimulationBasedOnRequestedValue } from '../../../src/modules/loanSimulation/interfaces';
import { LoanSimulationService } from '../../../src/modules/loanSimulation/service';
import { AuthenticationService } from '../../../src/shared/auth/auth';
import {
  makeInternalErrorResponse,
  makeInvalidParamsResponse,
  makeNotFoundResponse,
  makeUnauthorizedResponse,
} from '../helpers';
import { populateDatabase } from '../users/helpers';

describe('POST /loansimulations/simulate - Get an loan simulation based in the provided parameters', () => {
  const token = new AuthenticationService().generateToken({
    sub: 1,
    role: 'VALID_ROLE',
  });

  beforeAll(async () => {
    await global.prismaClient.consultant.deleteMany();
    await populateDatabase();
  });

  afterAll(async () => {
    await global.prismaClient.consultant.deleteMany();
  });

  it('should return 400 when provide invalid parameters', async () => {
    const response = await global.testRequest
      .post('/loansimulations/simulate')
      .set('x-access-token', token)
      .send({
        consultantId: 0,
        joinedTelemedicine: 'invalid',
        salaryReceiptDate: 'invalid',
        numberOfInstallments: 0,
        requestedValue: 'invalid',
        salary: 'invalid',
      });

    const invalidParamsResponse = makeInvalidParamsResponse([
      {
        fieldName: 'consultantId',
        friendlyFieldName: 'consultantId',
        message: '"consultantId" must be greater than or equal to 1',
      },
      {
        fieldName: 'joinedTelemedicine',
        friendlyFieldName: 'joinedTelemedicine',
        message: '"joinedTelemedicine" must be a boolean',
      },
      {
        fieldName: 'salaryReceiptDate',
        friendlyFieldName: 'salaryReceiptDate',
        message: '"salaryReceiptDate" must be a valid date',
      },
      {
        fieldName: 'numberOfInstallments',
        friendlyFieldName: 'numberOfInstallments',
        message: '"numberOfInstallments" must be greater than or equal to 1',
      },
      {
        fieldName: 'requestedValue',
        friendlyFieldName: 'requestedValue',
        message: '"requestedValue" must be a number',
      },
      {
        fieldName: 'salary',
        friendlyFieldName: 'salary',
        message: '"salary" must be a number',
      },
      {
        fieldName: 'monthOfPayment',
        friendlyFieldName: 'monthOfPayment',
        message: '"monthOfPayment" is required',
      },
    ]);
    expect(response.status).toBe(invalidParamsResponse.statusCode);
    expect(response.body).toEqual(invalidParamsResponse);
  });

  it('should return 404 when provided a consultant id that does not exists', async () => {
    const response = await global.testRequest
      .post('/loansimulations/simulate')
      .set('x-access-token', token)
      .send(
        makeLoanSimulationBasedOnRequestedValueParams({ consultantId: 10 }),
      );

    const notFoundResponse = makeNotFoundResponse(
      'consultant not found with provided id',
    );
    expect(response.status).toBe(notFoundResponse.statusCode);
    expect(response.body).toEqual(notFoundResponse);
  });

  it('should return 401 when not provide the access token', async () => {
    const response = await global.testRequest
      .post('/loansimulations/simulate')
      .send(makeLoanSimulationBasedOnRequestedValueParams());

    const unauthorizedResponse = makeUnauthorizedResponse(
      'token not provided',
      ErrorCodes.AUTH_ERROR_001,
    );
    expect(response.status).toBe(unauthorizedResponse.statusCode);
    expect(response.body).toEqual(unauthorizedResponse);
  });

  test.each([
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        monthOfPayment: MonthOfPayment.NEXT_MONTH,
      }),
      expected: loanSimulationOfDay15OfTheMonthWithTelemedicine,
    },
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        joinedTelemedicine: false,
        monthOfPayment: MonthOfPayment.NEXT_MONTH,
      }),
      expected: loanSimulationOfDay15OfTheMonthWithoutTelemedicine,
    },
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        joinedTelemedicine: false,
        monthOfPayment: MonthOfPayment.LAST_MONTH,
      }),
      expected:
        loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPayment,
    },
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        joinedTelemedicine: false,
        requestedValue: 800,
        monthOfPayment: MonthOfPayment.LAST_MONTH,
      }),
      expected:
        loanSimulationOfDay15OfTheMonthWithoutTelemedicineLastMonthPaymentRequestedValueLowerThan1000,
    },
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        joinedTelemedicine: false,
        salaryReceiptDate: undefined,
        monthOfPayment: MonthOfPayment.NEXT_MONTH,
      }),
      expected:
        loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDay,
    },
    {
      params: makeLoanSimulationBasedOnRequestedValueParams({
        joinedTelemedicine: false,
        salaryReceiptDate: undefined,
      }),
      expected:
        loanSimulationOfDay15OfTheMonthWithoutTelemedicineAndWithoutReceptSalaryDayCurrentMonth,
    },
  ])(
    'should return the details of loan simulation when provide $params as params',
    async ({ params, expected }) => {
      const response = await global.testRequest
        .post('/loansimulations/simulate')
        .set('x-access-token', token)
        .send({
          ...params,
        });

      const expectedResponse: IFormatedApiHttpResponse<ILoanSimulationBasedOnRequestedValue> =
        {
          statusCode: StatusCodes.OK,
          statusCodeAsString: 'OK',
          data: expected,
        };
      expect(response.status).toBe(expectedResponse.statusCode);
      // TODO: ajustar quando bug do prisma de usar faker timers for corrigido
      // expect(response.body).toEqual({
      //   ...expectedResponse,
      //   data: {
      //     ...expectedResponse.data,
      //     firstPaymentDates: expectedResponse.data.firstPaymentDates.map(d =>
      //       new Date(d).toISOString(),
      //     ),
      //   },
      // });
    },
  );

  it('Should return 500 when the service throws an exception error', async () => {
    const params = makeLoanSimulationBasedOnRequestedValueParams();
    jest
      .spyOn(
        LoanSimulationService.prototype,
        'simulateLoanBasedOnRequestedValue',
      )
      .mockRejectedValueOnce(new Error('create unexpected error'));
    const response = await global.testRequest
      .post('/loansimulations/simulate')
      .set('x-access-token', token)
      .send(params);
    const { validationErrors, ...internalServerError } =
      makeInternalErrorResponse();
    expect(response.status).toBe(500);
    expect(response.body).toEqual(internalServerError);
  });
});
