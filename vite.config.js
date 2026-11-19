import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    define: { __API_BASE__: JSON.stringify(env.VITE_API_URL || '') },
    server: { proxy: { '/api': 'http://localhost:3000' } },
  };
});
