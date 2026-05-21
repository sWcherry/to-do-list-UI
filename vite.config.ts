import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      requireEnv: false,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8', // або 'istanbul'
      // Вказуємо, які саме файли аналізувати (лише ваші 5 сторінок)
      include: ['src/pages/**/*.{ts,tsx}'], 
      thresholds: {
        // Налаштування глобального порогу для всіх включених файлів сумарно
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
})