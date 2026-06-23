// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site. Update `site` to your GitHub username and `base`
  // to your repo name if they differ.
  site: 'https://avetavos.github.io',
  base: '/go-deep-dive',
  output: 'static',
  integrations: [starlight({
      title: 'Go Deep Dive',
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        th: { label: 'ไทย', lang: 'th' },
      },
      customCss: ['./src/styles/custom.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/go-deep-dive' }],
      sidebar: [
        { label: 'Basics & Syntax', items: [{ autogenerate: { directory: 'basics' } }] },
        { label: 'Types & Data', items: [{ autogenerate: { directory: 'types-data' } }] },
        { label: 'Methods & Interfaces', items: [{ autogenerate: { directory: 'methods-interfaces' } }] },
        { label: 'Concurrency', items: [{ autogenerate: { directory: 'concurrency' } }] },
        { label: 'Errors & Generics', items: [{ autogenerate: { directory: 'errors-generics' } }] },
        { label: 'Standard Library', items: [{ autogenerate: { directory: 'stdlib' } }] },
        { label: 'Testing & Tooling', items: [{ autogenerate: { directory: 'testing-tooling' } }] },
      ],
      }), preact()],
});