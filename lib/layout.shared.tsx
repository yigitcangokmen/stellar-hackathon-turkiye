import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'Mock Anchor',
        url: 'https://tr-mock-anchor.fly.dev',
      },
      {
        text: 'Stellar Docs',
        url: 'https://developers.stellar.org',
      },
    ],
  };
}
