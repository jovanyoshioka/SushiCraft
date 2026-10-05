import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      writeBundle(options) {
        const outDir = options.dir || 'dist';
        fs.copyFileSync(
          path.resolve(outDir, 'index.html'),
          path.resolve(outDir, '404.html')
        );
      }
    }
  ],
  base: '/SushiCraft/',
})
