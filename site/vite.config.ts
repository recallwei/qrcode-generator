import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  esbuild: {
    drop: ["console", "debugger"]
  },
  server: {
    host: true,
    port: 4058,
    strictPort: true,
    open: false,
    proxy: {
      "/api-prefix": {
        target: "localhost:5173",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-prefix/, "")
      }
    }
  }
})
