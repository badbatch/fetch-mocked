import jestConfig from '@repodog/jest-config';
import swcConfig from '@repodog/swc-config';

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';

// Required for Jest
// eslint-disable-next-line import-x/no-default-export
export default {
  ...jestConfig({ compilerOptions: swcConfig }),
  setupFilesAfterEnv: ['@repodog/jest-config/setup.mjs', '<rootDir>/testSetup.mjs'],
  ...(!isDebug && { testMatch: ['<rootDir>/src/*.jest.test.ts'] }),
};
