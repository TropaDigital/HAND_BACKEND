import { StatusCodes } from 'http-status-codes';

export interface IApiHttpResponse<
  Body = unknown,
  Headers = { [key: string]: string },
  attachmentContentType = unknown,
> {
  body: Body;
  headers?: Headers;
  attachmentFileName?: string;
  attachmentFileContent?: attachmentContentType;
  statusCodeAsString: keyof typeof StatusCodes;
}
