import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const bff =
    env.VITE_BFF_URL ||
    process.env.VITE_BFF_URL ||
    (mode === 'production' ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');
  return {
    base: mode === 'production' ? '/gemini-mcp-maps/' : '/',
    define: {
      'import.meta.env.VITE_BFF_URL': JSON.stringify(bff),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});