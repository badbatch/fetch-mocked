const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';

module.exports = {
  ...jestConfig({ compilerOptions: swcConfig }),
  setupFilesAfterEnv: ['<rootDir>/testSetup.mjs'],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/src/*.jest.test.ts'] }),
};
