import supertest from 'supertest';

import MySqlDBClient from '../src/infra/mySql';
import App from '../src/App';

let server: App;
beforeAll(async () => {
  server = new App();
  await server.initApplication();
  global.testRequest = supertest(server.getInstance());
  const prismaClient = MySqlDBClient.getInstance().getPrismaClientInstance();
  global.prismaClient = prismaClient;
  global.app = server;
});

afterAll(async () => {
  await server.stopApplication();
});
