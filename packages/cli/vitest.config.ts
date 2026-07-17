import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/*.spec.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      reporter: ['text', 'lcov'],
      provider: 'v8',
      thresholds: {
        branches: 100,
      }
    },
  },
});
