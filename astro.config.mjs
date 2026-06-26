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
      head: [
        { tag: 'script', attrs: { type: 'module', src: '/go-deep-dive/enhance.js' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/go-deep-dive/manifest.webmanifest' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/go-deep-dive/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/go-deep-dive/icon-192.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#00ADD8' } },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: "Go Deep Dive" } },
        { tag: 'script', content: "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/go-deep-dive/sw.js',{scope:'/go-deep-dive/'}).catch(function(){})})}" },
      ],
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