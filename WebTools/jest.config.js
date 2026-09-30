module.exports = {
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          // Jest compiles tests to CommonJS. moduleResolution "bundler" is only
          // valid with an ES module setting, so tests keep the Node resolver.
          tsconfig: {
            module: 'commonjs',
            moduleResolution: 'node',
          },
        },
      ],
    },
    // The local Watchman binary aborts (missing libfmt), which stops Jest
    // before any tests run.
    watchman: false,
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };