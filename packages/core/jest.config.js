module.exports = {
  coverageReporters: ['text', 'lcov'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100
    }
  }
};
