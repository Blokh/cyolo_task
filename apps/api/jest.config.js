console.log('Loading jest.config.cjs...');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testRegex: '(/__tests__/.*|(\\.|/)(unit|e2e|intg)\\.test)\\.ts$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/env$': '<rootDir>/src/env.ts' // Add explicit mapping for env
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
};
