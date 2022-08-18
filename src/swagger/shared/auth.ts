import { ApiKeySecuritySchemeObject } from 'openapi-comment-parser';

export default {
  apiKey: {
    type: 'apiKey',
    in: 'header',
    name: 'x-access-token',
    description: 'token that will be used to authenticate in jaspion service',
  },
} as { [key: string]: ApiKeySecuritySchemeObject };
