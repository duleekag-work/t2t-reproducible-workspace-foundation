import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Read the single .env at the repository root rather than a second copy here.
  envDir: '../../',
  server: {
    // 0.0.0.0 is required for the port to be reachable from outside the container.
    host: '0.0.0.0',
    port: 5173,
  },
});
