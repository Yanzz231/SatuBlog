import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './404.module.css';

export default function NotFound(): ReactNode {
  return (
    <Layout title="Halaman Tidak Ditemukan">
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Halaman Tidak Ditemukan</h2>
          <p className={styles.description}>
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/">
              Kembali ke Beranda
            </Link>
            <Link className="button button--secondary button--lg" to="/blog">
              Lihat Blog
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
