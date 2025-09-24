import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
        'process.env.GITHUB_OWNER': JSON.stringify(env.GITHUB_OWNER),
        'process.env.GITHUB_REPO': JSON.stringify(env.GITHUB_REPO),
        'process.env.GITHUB_BRANCH': JSON.stringify(env.GITHUB_BRANCH),
        'process.env.GITHUB_IMAGES_PATH': JSON.stringify(env.GITHUB_IMAGES_PATH),
        'import.meta.env.VITE_UNSPLASH_ACCESS_KEY': JSON.stringify(env.UNSPLASH_ACCESS_KEY),
        'import.meta.env.VITE_UNSPLASH_SECRET_KEY': JSON.stringify(env.UNSPLASH_SECRET_KEY),
        'import.meta.env.VITE_UNSPLASH_APPLICATION_ID': JSON.stringify(env.UNSPLASH_APPLICATION_ID),
        'import.meta.env.VITE_UNSPLASH_REDIRECT_URI': JSON.stringify(env.UNSPLASH_REDIRECT_URI)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
