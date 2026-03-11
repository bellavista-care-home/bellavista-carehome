import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-plugin-prerender'

// All public-facing routes that crawlers should index
const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/schedule-tour',
  '/enquiry',
  '/our-homes',
  '/bellavista-barry',
  '/bellavista-cardiff',
  '/waverley-care-center',
  '/college-fields-nursing-home',
  '/baltimore-care-home',
  '/meadow-vale-cwtch',
  '/bellavista-pontypridd',
  '/events',
  '/facilities',
  '/news',
  '/newsletters',
  '/testimonials',
  '/faq',
  '/career',
  '/gallery',
  '/dining-and-nutrition',
  '/our-vision',
  '/our-values',
  '/our-care',
  '/management-team',
  '/current-jobs',
  '/training-and-development',
  '/visitor-policy',
  '/dementia-friendly-environment',
  '/privacy-policy',
  '/terms-of-service',
  '/bellavista-nursing-home',
  '/care-homes-cardiff',
  '/dementia-care-guide',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      staticDir: 'dist',
      routes: PRERENDER_ROUTES,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterTime: 2000,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    }),
  ],
  build: {
    sourcemap: false, // Security: Prevent source code leakage in production
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
})
