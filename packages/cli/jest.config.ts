import type { Config } from 'jest'
import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset({
  coverageReporters: ['text', 'lcov'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  roots: ['<rootDir>/src'],
  coverageThreshold: {
    global: {
      branches: 100
    }
  }
})

export default {
  ...presetConfig,
} satisfies Config
