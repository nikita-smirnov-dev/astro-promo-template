// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      iconDir: 'src/assets/icons',
      svgoOptions: {
        plugins: [
          {
            name: 'removeAttrs',
            params: { attrs: '(fill|stroke)' },
          },
          { name: 'removeDimensions' },
        ],
      },
    }),
  ],
});
