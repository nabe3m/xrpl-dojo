import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightSidebarTopics from 'starlight-sidebar-topics';

import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';

/** xrpld セクション（frontmatter の sidebar.order で並び順を制御） */
const xrpldSection = (label, directory, enLabel) => ({
  label,
  translations: { 'en-US': enLabel },
  collapsed: false,
  items: [{ autogenerate: { directory: `xrpld/${directory}`, collapsed: false } }],
});

// https://astro.build/config
export default defineConfig({
  site: 'https://xrpldojo.dev',
  integrations: [
    mermaid(),
    starlight({
      title: 'XRPL Dojo',
      routeMiddleware: ['./src/starlight-route-middleware.ts'],
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
      plugins: [
        starlightSidebarTopics([
          {
            label: 'XRPL Dojo',
            link: '/getting-started/',
            icon: 'open-book',
            items: [
              {
                label: 'スタートガイド',
                translations: { 'en-US': 'Start Guide' },
                items: [{ autogenerate: { directory: 'getting-started' } }],
              },
              {
                label: '開発用エディターの準備',
                translations: { 'en-US': 'Preparing the Development Editor' },
                items: [{ autogenerate: { directory: 'editor' } }],
              },
              {
                label: 'XRPLとは？',
                translations: { 'en-US': 'What is XRPL?' },
                items: [{ autogenerate: { directory: 'xrpl' } }],
              },
              {
                label: '入門',
                translations: { 'en-US': 'Introduction' },
                items: [{ autogenerate: { directory: 'basics' } }],
              },
              {
                label: '初段',
                translations: { 'en-US': 'Level 1' },
                items: [{ autogenerate: { directory: 'beginners' } }],
              },
              {
                label: '二段',
                translations: { 'en-US': 'Level 2' },
                items: [{ autogenerate: { directory: '2nd' } }],
              },
              {
                label: '三段',
                translations: { 'en-US': 'Level 3' },
                items: [{ autogenerate: { directory: '3rd' } }],
              },
              {
                label: '四段',
                translations: { 'en-US': 'Level 4' },
                items: [{ autogenerate: { directory: '4th' } }],
              },
            ],
          },
          {
            label: 'xrpld Dojo',
            link: '/xrpld/intro/about/',
            icon: 'seti:cpp',
            items: [
              xrpldSection('はじめに', 'intro', 'Introduction'),
              xrpldSection('一段：環境構築', 'level1', 'Level 1: Foundation'),
              xrpldSection('二段：コードを読む', 'level2', 'Level 2: Reading Code'),
              xrpldSection('三段：貢献する', 'level3', 'Level 3: Contributing'),
              xrpldSection('四段：深掘りする', 'level4', 'Level 4: Deep Dive'),
              xrpldSection('五段：ローカル実践', 'level5', 'Level 5: Hands-on Local Changes'),
              xrpldSection('六段：本格実装', 'level6', 'Level 6: Protocol Implementation'),
            ],
          },
        ]),
      ],
      components: {
        Head: './src/components/StarlightHead.astro',
        SkipLink: './src/components/SkipLink.astro',
      },
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
