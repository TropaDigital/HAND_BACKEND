enum ErrorCodes {
  GENERIC = 'GENERIC_ERROR',
  AUTH_ERROR_001 = 'TOKEN_NOT_PROVIDED',
  AUTH_ERROR_002 = 'INVALID_CREDENTIALS',
  FORGOT_PASSWORD_001 = 'FORGOT_PASSWORD_EMAIL_DOES_NOT_EXISTS',
  FORGOT_PASSWORD_002 = 'FORGOT_PASSWORD_INVALID_TOKEN',
  MISSING_OR_INVALID_PARAMETERS = 'MISSING_OR_INVALID_PARAMETERS',
  CREATE_BENEFIT_ERROR_001 = 'INVALID_BENEFIT_FINAL_DATE',
}

export default ErrorCodes;
