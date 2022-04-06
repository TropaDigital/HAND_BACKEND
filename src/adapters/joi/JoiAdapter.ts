import Joi from 'joi';

import ICustomJoiRoot from '../../interfaces/validation/ICustomJoiRoot';
import IValidationResult from '../../interfaces/validation/IValidationResult';
import IValidationResultDTO from '../../interfaces/validation/IValidationResultDTO';
import * as errors from '../../shared/errors';

export default class JoiAdapter<S = { [key: string]: Joi.Schema }> {
  constructor(
    private readonly schemaDictionary: S,
    private schemaClient: ICustomJoiRoot = Joi,
  ) {
    this.buildSchemas(schemaDictionary);
  }

  public validateSchema<T>(
    schemaName: keyof typeof this.schemaDictionary,
    data: T,
  ): T {
    if (!this.schemaClient[schemaName as keyof typeof this.schemaClient]) {
      throw new errors.GenericAppError('The schema provided does not exists');
    }

    const { hasValidationErrors, value, validationErrors } =
      this.normalizeValidationResult<T>(
        this.schemaClient[
          schemaName as keyof typeof this.schemaClient
        ]().validate(data, {
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

  private buildSchemas(schemaDictionary: S): void {
    const normalizedSchemas = Object.entries(schemaDictionary).map(
      ([schemaName, schema]): Joi.Extension => ({
        type: schemaName,
        base: schema,
      }),
    );

    this.schemaClient = this.schemaClient.extend(...normalizedSchemas);
  }
}
