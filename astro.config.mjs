import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'XRPL道場',
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
      head: [
        // Fathomのアナリティクススクリプトタグを追加する例。
        {
          tag: 'script',
          attrs: {
            src: '/script.js',
            'data-site': 'MY-FATHOM-ID',
            defer: true,
          },
        },
      ],
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
