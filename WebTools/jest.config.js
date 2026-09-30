module.exports = {
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          isolatedModules: true,
          // Jest compiles tests to CommonJS. moduleResolution "bundler" is only
          // valid with an ES module setting, so tests keep the Node resolver.
          tsconfig: {
            module: 'commonjs',
            moduleResolution: 'node',
          },
        },
      ],
    },
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };