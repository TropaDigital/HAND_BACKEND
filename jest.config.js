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
  coverageDirectory: 'coverage/unit',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/openapirc.ts',
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
    '!src/**/__tests__/**/*.ts',
    '!src/swagger/**/*.ts',
    '!src/config/**/*.ts',
    '!src/seeders/**/*.ts',
    'src/middlewares/ErrorMiddleware.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        pageTitle: 'Haand bib API',
        publicPath: './html-report',
        filename: 'unit.html',
        expand: false,
      },
    ],
  ],
};
