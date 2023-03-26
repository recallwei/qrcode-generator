import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        },
        {
          from: 'naive-ui',
          imports: ['FormInst', 'FormRules', 'UploadFileInfo', 'UploadCustomRequestOptions'],
          type: true
        }
      ],
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    host: true,
    port: 4058,
    strictPort: true,
    open: false,
    proxy: {
      '/api-prefix': {
        target: 'localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-prefix/, '')
      }
    }
  }
})
