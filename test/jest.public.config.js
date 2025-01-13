module.exports = {
  rootDir: '../',
  roots: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/test/setupTests.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.jest.ts'],
  testMatch: ['**/public/**/*.test.{ts,tsx,js,jsx}', '**/common/*.test.{ts, tsx}'],
  clearMocks: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    '<rootDir>/public/**/*.{ts,tsx,js,jsx}',
    '<rootDir>/common/**/*.{ts,tsx,js,jsx}',
  ],
};
