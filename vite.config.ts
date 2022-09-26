import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        worker: resolve(__dirname, 'src/worker.ts'),
        debug: resolve(__dirname, "debug.html")
       },
       output: {
        entryFileNames: 'assets/[name].js'
       }
    }
  }
})
