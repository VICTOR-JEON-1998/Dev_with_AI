module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
};
