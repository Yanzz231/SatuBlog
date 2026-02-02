import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog">
            Baca Artikel
          </Link>
          <Link
            className={clsx('button button--lg', styles.buttonOutline)}
            to="/docs/intro">
            Dokumentasi
          </Link>
        </div>
      </div>
    </header>
  );
}

function LatestPosts() {
  return (
    <section className={styles.latestPosts}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Artikel Terbaru
        </Heading>
        <p className={styles.sectionSubtitle}>
          Temukan berbagai artikel menarik seputar teknologi, programming, dan tips karir
        </p>
        <div className={styles.postsGrid}>
          <div className={styles.postCard}>
            <div className={styles.postCategory}>Tutorial</div>
            <h3>Memulai dengan React</h3>
            <p>Panduan lengkap untuk pemula yang ingin belajar React dari dasar.</p>
            <Link to="/blog" className={styles.postLink}>Baca selengkapnya</Link>
          </div>
          <div className={styles.postCard}>
            <div className={styles.postCategory}>Tips</div>
            <h3>Produktivitas Developer</h3>
            <p>Tips dan trik untuk meningkatkan produktivitas sebagai developer.</p>
            <Link to="/blog" className={styles.postLink}>Baca selengkapnya</Link>
          </div>
          <div className={styles.postCard}>
            <div className={styles.postCategory}>Karir</div>
            <h3>Persiapan Interview</h3>
            <p>Strategi dan persiapan menghadapi technical interview.</p>
            <Link to="/blog" className={styles.postLink}>Baca selengkapnya</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>
          Siap untuk Mulai?
        </Heading>
        <p className={styles.ctaSubtitle}>
          Bergabung dengan komunitas kami dan mulai berbagi pengetahuan
        </p>
        <div className={styles.ctaButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Beranda"
      description="SatuBlog - Berbagi Pengetahuan, Membangun Inspirasi">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <LatestPosts />
        <CallToAction />
      </main>
    </Layout>
  );
}
