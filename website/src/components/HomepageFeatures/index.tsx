import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Sync Across Environments',
    Svg: require('@site/static/img/sync.svg').default,
    description: (
      <>
        Seamlessly synchronize your Directus configurations across multiple environments. 
        Keep development, staging, and production instances perfectly aligned.
      </>
    ),
  },
  {
    title: 'Custom Data Management',
    Svg: require('@site/static/img/json.svg').default,
    description: (
      <>
        Populate and manage custom data across your Directus instances with powerful seeding capabilities.
        Handle complex relationships and configurations with ease.
      </>
    ),
  },
  {
    title: 'Version Control Ready',
    Svg: require('@site/static/img/git.svg').default,
    description: (
      <>
        Track changes to your Directus configurations and data with Git.
        Roll back changes, review differences, and collaborate with your team effectively.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-vert--lg intro-svg">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
