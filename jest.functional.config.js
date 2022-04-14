const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  collectCoverageFrom: ['src/**/*controller.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
