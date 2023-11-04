module.exports = {
  extends: ['@repodog/eslint-config'],
  overrides: [
    {
      extends: ['@repodog/eslint-config-jest'],
      files: ['**/*.{spec,test}.*'],
      rules: {
        'jest/max-nested-describe': [
          2,
          {
            max: 7,
          },
        ],
        'jest/no-duplicate-hooks': 0,
      },
    },
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    // disabled devDependencies due to https://github.com/import-js/eslint-plugin-import/issues/2168
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
        peerDependencies: false,
      },
    ],
  },
};
