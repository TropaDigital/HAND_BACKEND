import * as http from 'http';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request extends http.IncomingMessage, Express.Request {
    user?: ResponseUser;
  }
}
