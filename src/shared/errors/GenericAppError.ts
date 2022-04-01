import { StatusCodes } from 'http-status-codes';

import ErrorCodes from '../../enums/ErrorCodes';
import IValidationError from '../../interfaces/validation/IValidationError';

export default class GenericAppError extends Error {
  /**
   * @constructor
   * @param {string} description - Descrição do erro encontrado
   * @param {number} [status=400] - Status code da requisição
   * @param {string} [code='GENERIC_ERROR'] - código interno de erro
   * @param {IValidationError[]} [validationErrors=[]] - erros de validação de schema
   * @param {boolean} [isOperational=true] - true é um erro esperado, false se é inesperado
   */
  constructor(
    public description: string,
    public status: number = StatusCodes.BAD_REQUEST,
    public code: string = ErrorCodes.GENERIC,
    public validationErrors: IValidationError[] = [],
    public isOperational: boolean = true,
  ) {
    super(description);
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}
