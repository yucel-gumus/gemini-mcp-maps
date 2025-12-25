import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: mode === 'production' ? '/gemini-mcp-maps/' : '/',
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:8000'
      )
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
