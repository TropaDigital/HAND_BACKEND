/* eslint-disable @typescript-eslint/naming-convention */
declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }

  interface Global {
    prismaClient: PrismaClient;
  }
}
