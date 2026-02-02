import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Konten Berkualitas',
    icon: '📚',
    description: (
      <>
        Artikel dan tutorial yang ditulis dengan riset mendalam,
        membantu Anda memahami konsep dari dasar hingga mahir.
      </>
    ),
  },
  {
    title: 'Praktis & Aplikatif',
    icon: '💡',
    description: (
      <>
        Setiap tutorial dilengkapi dengan contoh kode yang bisa
        langsung dipraktikkan dalam proyek nyata Anda.
      </>
    ),
  },
  {
    title: 'Update Terkini',
    icon: '🚀',
    description: (
      <>
        Konten selalu diperbarui mengikuti perkembangan teknologi
        terbaru dan best practices industri.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Mengapa SatuBlog?
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
