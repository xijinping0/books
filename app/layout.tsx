import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import CustomSearchDialog from '@/components/search';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 天朝禁书',
    default: '天朝禁书',
  },
  description: '天朝禁书',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            SearchDialog: CustomSearchDialog,
          }}
          i18n={{
            locale: 'zh-CN',
            translations: {
              search: '搜索',
              searchNoResult: '无结果',
              toc: '目录',
              tocNoHeadings: '无',
              lastUpdate: '更新于',
              chooseLanguage: '选择语言',
              nextPage: '下一页',
              previousPage: '上一页',
              chooseTheme: '选择主题',
              editOnGithub: '在 GitHub 上编辑',
            },
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
