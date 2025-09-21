'use client';

import { ReactCusdis } from 'react-cusdis';
import React from 'react';
import { type Page } from 'fumadocs-core/source';

interface CommentBlockProps {
  page: Pick<Page, 'url' | 'data'>;
}

const CommentBlock = ({ page }: CommentBlockProps) => {
  const host = process.env.NEXT_PUBLIC_CUSDIS_HOST;
  const appId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;

  if (host == null || appId == null) {
    return null;
  }

  return (
    <ReactCusdis
      lang="zh-cn"
      attrs={{
        host,
        appId,
        pageId: page.url,
        pageTitle: page.data.title,
        pageUrl: page.url,
      }}
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    />
  );
};

export default CommentBlock;
