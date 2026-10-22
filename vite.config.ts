import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Get __dirname equivalent in ESM
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Custom plugin to resolve figma:asset imports
function figmaAssetPlugin() {
  return {
    name: 'vite-plugin-figma-asset',
    resolveId(id: string) {
      // Handle figma:asset/xxx.png imports
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        // Resolve to src/assets/{filename}
        return new URL(`./src/assets/${filename}`, import.meta.url).pathname
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Custom plugin to resolve figma:asset imports
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Honour the port the preview manager assigns; fall back to the demo port.
    port: Number(process.env.PORT) || 32104,
  },
})
