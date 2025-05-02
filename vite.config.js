import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: 'main.js',
          template: 'template.html',
          filename: 'index.html',
          injectOptions: {
            data: {
              title: 'NYxplore | Premium NYC Guide',
              description: 'Discover the best of New York City with our premium guides',
              pageClass: 'home'
            }
          }
        },
        {
          entry: 'seasonal-events.js',
          template: 'template.html',
          filename: 'seasonal-events.html',
          injectOptions: {
            data: {
              title: 'NYxplore | Seasonal Events',
              description: 'Discover New York City\'s best seasonal events',
              pageClass: 'seasonal-events',
              heroImage: 'seasonal-hero.jpg'
            }
          }
        },
        // Add other pages similarly...
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'template.html')
      }
    }
  }
});