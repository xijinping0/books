import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: '天朝禁书',
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  githubUrl: 'https://github.com/xijinping0/books',
  links: [],
};
