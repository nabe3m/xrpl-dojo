import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';

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
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/nabe3m/',
        },
        {
          icon: 'x.com',
          label: 'X (Twitter)',
          href: 'https://twitter.com/nabe3_m',
        },
      ],
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
    jopSoftwarecookieconsent({
      mode: 'opt-in',
      autoShow: true,
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
        },
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We value your privacy',
              description: 'We use cookies to enhance your experience.',
              acceptAllBtn: 'Accept All',
              acceptNecessaryBtn: 'Accept Necessary',
              showPreferencesBtn: 'Manage Preferences',
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              sections: [
                {
                  title: 'Necessary Cookies',
                  description:
                    'These cookies are essential for the website to function properly.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics Cookies',
                  description:
                    'These cookies help us understand how visitors interact with the website.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    }),
  ],
});
