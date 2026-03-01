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
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/satublog/satublog/tree/main/",
          remarkPlugins: [
            [
              require("@docusaurus/remark-plugin-npm2yarn"),
              {
                sync: true,
                converters: [
                  "pnpm",
                  "yarn",
                  [
                    "Bun",
                    (code: string) =>
                      code
                        .replace(/^npm install /gm, "bun add ")
                        .replace(/^npm i /gm, "bun add ")
                        .replace(/^npm run /gm, "bun run ")
                        .replace(/^npm /gm, "bun "),
                  ],
                ],
              },
            ],
          ],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: [
    "@docusaurus/theme-mermaid",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en"],
        indexDocs: true,
        docsRouteBasePath: "/",
        searchBarPosition: "right",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
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
      title: "SatuBlog",
      hideOnScroll: false,
      items: [
        {
          href: "https://github.com/yanzz231",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        "bash",
        "json",
        "typescript",
        "python",
        "java",
        "php",
      ],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "error-next-line",
          block: { start: "error-start", end: "error-end" },
        },
      ],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
