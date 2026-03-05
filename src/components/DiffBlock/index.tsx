import React from "react";
import CodeBlock from "@theme/CodeBlock";
import styles from "./styles.module.css";

interface DiffBlockProps {
  lang?: string;
  before: string;
  after: string;
  beforeTitle?: string;
  afterTitle?: string;
}

export default function DiffBlock({
  lang = "typescript",
  before,
  after,
  beforeTitle = "Before",
  afterTitle = "After",
}: DiffBlockProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.panel} ${styles.panelBefore}`}>
        <div className={styles.label}>
          <span className={styles.dot} data-variant="before" />
          {beforeTitle}
        </div>
        <div className={styles.codeWrap}>
          <CodeBlock language={lang}>{before.trim()}</CodeBlock>
        </div>
      </div>
      <div className={`${styles.panel} ${styles.panelAfter}`}>
        <div className={styles.label}>
          <span className={styles.dot} data-variant="after" />
          {afterTitle}
        </div>
        <div className={styles.codeWrap}>
          <CodeBlock language={lang}>{after.trim()}</CodeBlock>
        </div>
      </div>
    </div>
  );
}
