import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  findFirstSidebarItemLink,
  useDocById,
} from '@docusaurus/plugin-content-docs/client';
import { usePluralForm } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/DocCard';
import styles from './styles.module.css';

type DocCardItem = Props['item'];
type LinkItem = Extract<DocCardItem, { type: 'link' }>;
type CategoryItem = Extract<DocCardItem, { type: 'category' }>;

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index page',
        },
        { count },
      ),
    );
}

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <CardContainer href={href}>
      <h2
        className={clsx('text--truncate', styles.cardTitle)}
        title={title}
        aria-label={title}
      >
        {title}
      </h2>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}
        >
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({ item }: { item: CategoryItem }) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  if (!href) return null;
  return (
    <CardLayout
      href={href}
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({ item }: { item: LinkItem }) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({ item }: Props): ReactNode {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
