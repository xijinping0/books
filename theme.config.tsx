import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from "next/router";

import { BOOK_NAMES } from "./utils";

const shortFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const getBookName = (path: string): string | undefined => {
  const tokens = path.split('/');
  if (tokens.length < 0) {
    return undefined;
  }
  return BOOK_NAMES[tokens[1]];
}

const config: DocsThemeConfig = {
  logo: (
    <>
      <img src="/book.svg" alt="logo" />
      <span style={{ marginLeft: '.4em', fontWeight: 800 }}>
        天朝禁书
      </span>
    </>
  ),
  project: {
    link: 'https://github.com/xijinping0/books',
  },
  docsRepositoryBase: 'https://github.com/xijinping0/books/tree/main',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="天朝禁书" />
      <meta property="og:description" content="天朝禁书" />
      <link rel="icon" href="/book.svg" type="image/svg+xml" />
    </>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter();
    return {
      titleTemplate: ['%s', getBookName(asPath)].filter(Boolean).join(' | ')
    }
  },
  toc: {
    backToTop: true,
  },
  search: {
    error: '搜索失败，请重试',
    placeholder: '搜索',
  },
  editLink: {
    text: '在 GitHub 上编辑此页',
  },
  gitTimestamp({ timestamp }) {
    return (
      <div>
        更新时间：{shortFormatter.format(new Date(timestamp))}
      </div>
    )
  },
  feedback: {
    content: null,
  },
  footer: {
    text: '天朝禁书',
  },
}

export default config
