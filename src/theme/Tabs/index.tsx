/* Swizzled Tabs — adds package manager icons to npm2yarn tabs */

import React, {
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useScrollPositionBlocker,
  useTabs,
  sanitizeTabsChildren,
  type TabItemProps,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type { Props } from '@theme/Tabs';
import styles from './styles.module.css';

const NpmIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ flexShrink: 0 }}>
    <rect width="24" height="24" rx="3" fill="#CB3837" />
    <path
      d="M4.5 4.5v15h15V4.5H4.5zm12 12h-3v-7.5H12v7.5H6.5V7h10v9.5z"
      fill="#ffffff"
    />
  </svg>
);

const PnpmIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect x="8.5" y="0" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect x="17" y="0" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect x="0" y="8.5" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect
      x="8.5"
      y="8.5"
      width="7"
      height="7"
      rx="1.2"
      fill="#F69220"
      opacity="0.4"
    />
    <rect x="17" y="8.5" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect x="0" y="17" width="7" height="7" rx="1.2" fill="#F69220" />
    <rect x="8.5" y="17" width="7" height="7" rx="1.2" fill="#F69220" />
  </svg>
);

const YarnIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="#2C8EBB" />
    <path
      d="M7 9.5c2-1.5 4-1.5 6 0s4 1.5 6 0M7 12.5c2-1.5 4-1.5 6 0s4 1.5 6 0M8 15.5c1.5-1 3-1 4.5 0s3 1 4.5 0"
      stroke="#fff"
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const BunIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ flexShrink: 0 }}>
    <ellipse cx="12" cy="14" rx="9" ry="7" fill="#C8A96E" />
    <ellipse cx="12" cy="10" rx="9" ry="6.5" fill="#F0C975" />
    <ellipse cx="12" cy="9.5" rx="7" ry="5" fill="#F5D98B" />
    <circle cx="10" cy="10" r="1" fill="#3b2a1a" />
    <circle cx="14" cy="10" r="1" fill="#3b2a1a" />
    <path
      d="M10 13 q2 1.5 4 0"
      stroke="#3b2a1a"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const PM_ICONS: Record<string, ReactNode> = {
  npm: <NpmIcon />,
  pnpm: <PnpmIcon />,
  yarn: <YarnIcon />,
  Bun: <BunIcon />,
};

function TabLabel({
  value,
  label,
}: {
  value: string;
  label: ReactNode;
}): ReactNode {
  const icon = PM_ICONS[value];
  if (!icon) return <>{label ?? value}</>;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}>
      {icon}
      {label ?? value}
    </span>
  );
}

function TabList({
  className,
  block,
  selectedValue,
  selectValue,
  tabValues,
}: Props & ReturnType<typeof useTabs>) {
  const tabRefs: (HTMLLIElement | null)[] = [];
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();

  const handleTabChange = (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex]!.value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null;

    switch (event.key) {
      case 'Enter': {
        handleTabChange(event);
        break;
      }
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0]!;
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1]!;
        break;
      }
      default:
        break;
    }

    focusElement?.focus();
  };

  return (
    <ul
      role="tablist"
      aria-orientation="horizontal"
      className={clsx(
        'tabs',
        {
          'tabs--block': block,
        },
        className,
      )}>
      {tabValues.map(({ value, label, attributes }) => (
        <li
          role="tab"
          tabIndex={selectedValue === value ? 0 : -1}
          aria-selected={selectedValue === value}
          key={value}
          ref={(tabControl) => {
            tabRefs.push(tabControl);
          }}
          onKeyDown={handleKeydown}
          onClick={handleTabChange}
          {...attributes}
          className={clsx(
            'tabs__item',
            styles.tabItem,
            attributes?.className as string,
            {
              'tabs__item--active': selectedValue === value,
            },
          )}>
          <TabLabel value={value} label={label} />
        </li>
      ))}
    </ul>
  );
}

function TabContent({
  lazy,
  children,
  selectedValue,
}: Props & ReturnType<typeof useTabs>) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(
    Boolean,
  ) as ReactElement<TabItemProps>[];
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem.props.value === selectedValue,
    );
    if (!selectedTabItem) {
      return null;
    }
    return cloneElement(selectedTabItem, {
      className: clsx('margin-top--md', selectedTabItem.props.className),
    });
  }
  return (
    <div className="margin-top--md">
      {childTabs.map((tabItem, i) =>
        cloneElement(tabItem, {
          key: i,
          hidden: tabItem.props.value !== selectedValue,
        }),
      )}
    </div>
  );
}

function TabsComponent(props: Props): ReactNode {
  const tabs = useTabs(props);
  return (
    <div
      className={clsx(
        ThemeClassNames.tabs.container,
        'tabs-container',
        styles.tabList,
      )}>
      <TabList {...tabs} {...props} />
      <TabContent {...tabs} {...props} />
    </div>
  );
}

export default function Tabs(props: Props): ReactNode {
  const isBrowser = useIsBrowser();
  return (
    <TabsComponent key={String(isBrowser)} {...props}>
      {sanitizeTabsChildren(props.children)}
    </TabsComponent>
  );
}
