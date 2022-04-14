import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';

import App from '../src/App';

let server: App;
beforeAll(async () => {
  server = new App();
  await server.initApplictation();
  await server.initServer();
  global.testRequest = supertest(server.getInstance());
  const prismaClient = new PrismaClient();
  await prismaClient.$connect();
  global.prismaClient = prismaClient;
});

afterAll(async () => {
  await server.stopApplication();
  global.prismaClient.$disconnect();
});
