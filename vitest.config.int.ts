import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    testMatch: ['**/*.int.test.ts'],
    testTimeout: 8000,
  },
})
