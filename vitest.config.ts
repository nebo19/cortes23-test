import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      database: resolve(__dirname, './src/database'),
      utils: resolve(__dirname, './src/utils'),
    },
  },
});
