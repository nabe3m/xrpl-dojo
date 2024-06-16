import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://xrpldojo.dev',
  integrations: [
    starlight({
      title: 'XRPL Dojo',
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
          translations: { 'en-US': 'Start Guide' },
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: '開発用エディターの準備',
          translations: { 'en-US': 'Preparing the Development Editor' },
          autogenerate: { directory: 'editor' },
        },
        {
          label: 'XRPLとは？',
          translations: { 'en-US': 'What is XRPL?' },
          autogenerate: { directory: 'xrpl' },
        },
        {
          label: '入門',
          translations: { 'en-US': 'Introduction' },
          // collapsed: true,
          autogenerate: { directory: 'basics' },
        },
        {
          label: '初段',
          translations: { 'en-US': 'Level 1' },
          // collapsed: true,
          autogenerate: { directory: 'beginners' },
        },
        {
          label: '二段',
          translations: { 'en-US': 'Level 2' },
          // collapsed: true,
          autogenerate: { directory: '2nd' },
        },
        {
          label: '三段',
          translations: { 'en-US': 'Level 3' },
          autogenerate: { directory: '3rd' },
        },
        {
          label: '四段',
          translations: { 'en-US': 'Level 4' },
          autogenerate: { directory: '4th' },
        },
        // {
        //   label: 'チュートリアル',
        //   translations: { 'en': 'Tutorials' },
        //   autogenerate: { directory: 'tutorials' },
        // },
      ],
    }),
  ],
});
