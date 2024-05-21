import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from "next/router";

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
  switch (tokens[1]) {
    case 'lovers': {
      return '习近平和他的情人们';
    }
    case 'roulette': {
      return '红色赌盘';
    }
    default: {
      return undefined;
    }
  }
}

const config: DocsThemeConfig = {
  logo: <span>天朝禁书</span>,
  project: {
    link: 'https://github.com/xijinping0/books',
  },
  docsRepositoryBase: 'https://github.com/xijinping0/books',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="天朝禁书" />
      <meta property="og:description" content="天朝禁书" />
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
