import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://xrpldojo.dev',
  integrations: [
    starlight({
      title: 'XRPL道場',
      favicon: '/images/favicon.png',
      logo: {
        src: './src/assets/images/logo-xrpl-dojo.webp',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: '日本語',
          lang: 'ja-JP',
        },
      },
      social: {
        // github: 'https://github.com/withastro/starlight',
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
          label: 'チュートリアル',
          autogenerate: { directory: 'tutorials' },
        },
      ],
    }),
  ],
});
