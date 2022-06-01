import * as http from 'http';

import { IJwtToken } from '../shared/auth/interfaces';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request extends http.IncomingMessage, Express.Request {
    user?: IJwtToken;
  }
}
