import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SatuBlog",
  tagline: "Berbagi Pengetahuan, Membangun Inspirasi",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://satublog.id",
  baseUrl: "/",

  organizationName: "satublog",
  projectName: "satublog",

  onBrokenLinks: "throw",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/satublog/satublog/tree/main/",
        },
        blog: {
          showReadingTime: true,
          readingTime: ({ content, defaultReadingTime, locale }) =>
            defaultReadingTime({
              content,
              locale,
              options: { wordsPerMinute: 200 },
            }),
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: "https://github.com/satublog/satublog/tree/main/",
          blogTitle: "Blog",
          blogDescription: "Artikel dan tutorial terbaru",
          postsPerPage: 10,
          blogSidebarTitle: "Artikel Terbaru",
          blogSidebarCount: 5,
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.jpg",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Satu Blog",
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Dokumentasi",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/yanzz231",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Konten",
          items: [
            {
              label: "Dokumentasi",
              to: "/docs/intro",
            },
            {
              label: "Blog",
              to: "/blog",
            },
          ],
        },
        {
          title: "Komunitas",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/satublog",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/satublog",
            },
          ],
        },
        {
          title: "Lainnya",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/satublog",
            },
            {
              label: "RSS Feed",
              to: "/blog/rss.xml",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SatuBlog. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "json",
        "typescript",
        "python",
        "java",
        "php",
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
