const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/openapirc.ts',
    '!src/**/*.spec.ts',
    '!src/interfaces/**/*.ts',
    '!src/enums/**/*.ts',
    '!src/modules/**/index.ts',
    '!src/modules/**/routes.ts',
    '!src/modules/**/factory.ts',
    '!src/middlewares/*.ts',
    '!src/App.ts',
    '!src/index.ts',
    '!src/shared/errors/*.ts',
    'src/middlewares/ErrorMiddleware.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
