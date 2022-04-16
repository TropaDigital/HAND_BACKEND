/* eslint-disable @typescript-eslint/naming-convention */
declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
    prismaClient: import('@prisma/client').PrismaClient;
    app: import('../src/App').default;
  }
}
