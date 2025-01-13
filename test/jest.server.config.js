module.exports = {
  rootDir: '../',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/server/**/*.test.{ts,js}', '**/common/*.test.{ts, tsx}'],
  clearMocks: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    '<rootDir>/server/**/*.{ts,tsx,js,jsx}',
    '<rootDir>/common/**/*.{ts,tsx,js,jsx}',
  ],
};
