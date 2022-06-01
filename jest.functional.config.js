const { resolve } = require('path');

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'functional-tests',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./__tests__/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*controller.ts',
    'src/**/*service.ts',
    'src/middlewares/*.ts',
    '!src/middlewares/RateLimit.ts',
    '!src/config/**/*.ts',
    '!src/seeders/**/*.ts',
    '!src/swagger/**/*.ts',
  ],
  coverageDirectory: 'coverage/functional',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        pageTitle: 'Haand bib API',
        publicPath: './html-report',
        filename: 'functional.html',
        expand: false,
      },
    ],
  ],
};
