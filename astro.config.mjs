import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://xrpldojo.dev',
  integrations: [
    starlight({
      title: 'XRPL道場 -DOJO-',
      favicon: '/favicon.png',
      logo: {
        src: './src/assets/images/logo-xrpl-dojo.webp',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: '日本語',
          lang: 'ja-JP',
        },
        en: {
          label: 'English',
          lang: 'en-US',
        },
      },
      social: {
        github: 'https://github.com/Nabe3m/',
        'x.com': 'https://twitter.com/nabe3_m',
      },
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/gtag.js',
            defer: true,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://xrpldojo.dev/ogp.png',
          },
        },
        {
          tag: 'script',
          attrs: {
            src: '/script.js',
            defer: true,
          },
        },
      ],
      components: {
        SkipLink: './src/components/SkipLink.astro',
      },
      sidebar: [
        {
          label: 'スタートガイド',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: '開発用エディターの準備',
          autogenerate: { directory: 'editor' },
        },
        {
          label: 'XRPLとは？',
          autogenerate: { directory: 'xrpl' },
        },
        {
          label: '入門編',
          autogenerate: { directory: 'basics' },
        },
        {
          label: '初段編',
          autogenerate: { directory: 'beginners' },
        },
        // {
        //   label: 'チュートリアル',
        //   autogenerate: { directory: 'tutorials' },
        // },
      ],
    }),
  ],
});
