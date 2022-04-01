import Joi from 'joi';

import CustomJoiRoot from '../../interfaces/validation/CustomJoiRoot';
import IValidationResult from '../../interfaces/validation/IValidationResult';
import IValidationResultDTO from '../../interfaces/validation/IValidationResultDTO';
import * as errors from '../../shared/errors';

export default class JoiAdapter {
  constructor(
    private readonly schemaDictionary: Record<string, Joi.Schema>,
    private schemaClient: CustomJoiRoot = Joi,
  ) {
    this.buildSchemas(schemaDictionary);
  }

  public validateSchema<T>(
    schemaName: keyof typeof this.schemaDictionary,
    data: T,
  ): T {
    if (!this.schemaClient[schemaName]) {
      throw new errors.GenericAppError('The schema provided does not exists');
    }

    const { hasValidationErrors, value, validationErrors } =
      this.normalizeValidationResult<T>(
        this.schemaClient[schemaName]().validate(data, {
          abortEarly: false,
          stripUnknown: true,
          //   messages: validationMessages,
        }),
      );

    if (!hasValidationErrors) return value;

    throw new errors.MissingInvalidParamsError(
      undefined,
      undefined,
      validationErrors,
    );
  }

  private normalizeValidationResult<T>(
    validationResult: IValidationResult,
  ): IValidationResultDTO<T> {
    return {
      hasValidationErrors: !!validationResult.error,
      value: validationResult.value,
      validationErrors: validationResult.error
        ? validationResult.error.details.map(error => ({
            fieldName: error.context?.key as string,
            friendlyFieldName: error.context?.label as string,
            message: error.message,
          }))
        : undefined,
    };
  }

  private buildSchemas(schemaDictionary: Record<string, Joi.Schema>): void {
    const normalizedSchemas = Object.entries(schemaDictionary).map(
      ([schemaName, schema]): Joi.Extension => ({
        type: schemaName,
        base: schema,
      }),
    );

    this.schemaClient = this.schemaClient.extend(...normalizedSchemas);
  }
}
