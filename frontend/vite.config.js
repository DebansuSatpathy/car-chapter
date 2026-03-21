import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set VITE_BASE_PATH=/repo-name/ when building for GitHub Pages (see .github/workflows).
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
