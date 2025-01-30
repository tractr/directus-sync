import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/installation', 'getting-started/usage'],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/synchronization',
        'features/seed',
        'features/configuration',
        'features/hooks',
        'features/helpers',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'how-it-works/id-mapping',
        'how-it-works/synchronization-process',
        'how-it-works/schema-management',
      ],
    },
    {
      type: 'category',
      label: 'Use Cases',
      items: ['use-cases/postgresql-enum', 'use-cases/upgrade-directus'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/firewall-configurations',
        'troubleshooting/collections-prefix',
      ],
    },
  ],
};

export default sidebars;
