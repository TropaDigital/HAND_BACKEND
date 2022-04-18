import { ExampleObject, ReferenceObject } from 'openapi-comment-parser';

export default {
  HealthlyResponse: {
    value: {
      statusCode: 200,
      statusCodeAsString: 'OK',
      data: {
        name: 'haand-bid',
        version: '1.0.0',
        uptime: '948 secs',
        status: 'healthly',
        database: { status: 'healthly', connectionStatus: 'connected' },
      },
    },
  },
  UnhealthlyResponse: {
    value: {
      statusCode: 500,
      statusCodeAsString: 'INTERNAL_SERVER_ERROR',
      data: {
        name: 'haand-bid',
        version: '1.0.0',
        uptime: '1225 secs',
        status: 'unhealthy',
        database: { status: 'unhealthy', connectionStatus: 'disconnected' },
      },
    },
  },
} as { [key: string]: ExampleObject | ReferenceObject };
