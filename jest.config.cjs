const config = require('@repodog/jest-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';

module.exports = {
  ...config,
  setupFilesAfterEnv: ['<rootDir>/testSetup.mjs'],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/src/*.jest.test.ts'] }),
};
